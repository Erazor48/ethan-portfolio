import { NextRequest, NextResponse } from 'next/server'
import { ragSystem } from '@/lib/rag/rag-system'

import mammoth from 'mammoth'
import ExcelJS from 'exceljs'
import pdf from 'pdf-parse'
import Tesseract from 'tesseract.js'
import { GoogleGenerativeAI } from '@google/generative-ai'

export const runtime = 'nodejs'

// Extraction PDF avec pdf-parse
async function extractPdfText(buffer: Buffer): Promise<string> {
    try {
        const data = await pdf(buffer)
        return data.text.trim()
    } catch (err) {
        console.error('PDF extraction failed:', err)
        throw new Error(`PDF processing failed: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
}

// Extraction multi-formats
async function extractText(file: File): Promise<string> {
    const name = (file.name || '').toLowerCase()
    const type = (file.type || '').toLowerCase()

    console.log(`Extracting text from: ${name} (${type})`)

    try {
        // --- TEXT & CODE ---
        if (
            type.startsWith('text/') ||
            name.endsWith('.txt') ||
            name.endsWith('.md') ||
            name.endsWith('.py') ||
            name.endsWith('.js') ||
            name.endsWith('.ts') ||
            name.endsWith('.json') ||
            name.endsWith('.csv')
        ) {
            return await file.text()
        }

        // Convert file to Buffer for all other cases
        const buffer = Buffer.from(await file.arrayBuffer())

        // --- DOCX ---
        if (name.endsWith('.docx')) {
            const { value } = await mammoth.extractRawText({ buffer })
            return value
        }

        // --- XLSX / XLS ---
        if (name.endsWith('.xlsx') || name.endsWith('.xls')) {
            const workbook = new ExcelJS.Workbook()
            // Convertir Buffer en ArrayBuffer pour ExcelJS
            await workbook.xlsx.load(buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength))
            let out = ''

            workbook.eachSheet((worksheet) => {
                out += `\n--- Sheet: ${worksheet.name} ---\n`

                worksheet.eachRow((row) => {
                    const rowValues: string[] = []
                    row.eachCell((cell) => {
                        rowValues.push(cell.text || cell.value?.toString() || '')
                    })
                    out += rowValues.join(',') + '\n'
                })
            })

            return out
        }

        // --- PDF ---
        if (name.endsWith('.pdf')) {
            return await extractPdfText(buffer)
        }

        // --- IMAGES (OCR) ---
        if (type.startsWith('image/') || name.match(/\.(png|jpg|jpeg)$/)) {
            const { data } = await Tesseract.recognize(buffer, 'eng')
            return data.text
        }

        // --- Fallback ---
        return await file.text()
    } catch (err) {
        console.error(`Error extracting text from ${name}:`, err)
        return `Error processing ${name}: ${err instanceof Error ? err.message : 'Unknown error'}`
    }
}

export async function POST(req: NextRequest) {
    try {
        console.log('POST /api/ingest/file - Starting')

        // Ensure RAG system initialized
        if (!ragSystem.isInitialized) {
            await ragSystem.initialize()
        }


        const form = await req.formData()
        const files = form.getAll('files') as File[]
        console.log(`Received ${files.length} files`)

        if (!files || files.length === 0) {
            return NextResponse.json({ error: 'Missing files' }, { status: 400 })
        }

        let ingested = 0
        for (const file of files) {
            console.log(`Processing file: ${file.name} (${file.size} bytes, ${file.type})`)

            // Size limit (10 MB)
            const sizeMb = (file.size || 0) / (1024 * 1024)
            if (sizeMb > 10) {
                console.log(`File ${file.name} too large (${sizeMb.toFixed(1)}MB), skipping`)
                continue
            }

            try {
                const text = (await extractText(file)).slice(0, 300_000)
                if (!text.trim()) {
                    console.log(`No text extracted from ${file.name}`)
                    continue
                }

                console.log(`Extracted ${text.length} chars from ${file.name}`)
                const doc = await ragSystem.addTextDocument({
                    content: text,
                    title: file.name,
                    type: 'note',
                    temporary: true,
                })

                console.log(`Added doc: ${doc.metadata.id}`)
                ingested++
            } catch (err) {
                console.error(`Failed to process ${file.name}:`, err)
            }
        }

        return NextResponse.json({ status: 'ok', ingested })
    } catch (err: any) {
        console.error('Upload error:', err)
        return NextResponse.json({ error: err?.message || 'Upload error' }, { status: 500 })
    }
}

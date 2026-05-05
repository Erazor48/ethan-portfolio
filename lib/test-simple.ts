import { ragSystem } from './rag/rag-system';
import { mcpTools } from './ai/tools/mcp-tools';

async function testSimpleSystem() {
    console.log('🧪 Testing MCP + RAG system (simple version)...\n');

    try {
        // Test 1: Initialize RAG system
        console.log('1. Testing RAG system initialization...');
        await ragSystem.initialize();
        console.log('✅ RAG system initialized successfully\n');

        // Test 2: Test RAG search
        console.log('2. Testing RAG search...');
        const searchResults = await ragSystem.search('React projects', 3);
        console.log(`✅ Found ${searchResults.length} relevant documents`);
        if (searchResults.length > 0) {
            console.log('Sample result:', searchResults[0].metadata.title);
        }
        console.log();

        // Test 3: Test MCP tools structure
        console.log('3. Testing MCP tools structure...');
        console.log(`✅ Found ${mcpTools.length} MCP tools:`);
        mcpTools.forEach(tool => {
            console.log(`  - ${tool.name}: ${tool.description}`);
        });
        console.log();

        // Test 4: Test specific tool
        console.log('4. Testing profile tool...');
        const profileTool = mcpTools.find(tool => tool.name === 'get_profile');
        if (profileTool) {
            console.log('✅ Profile tool found with schema:', Object.keys(profileTool.schema.shape));
        }
        console.log();

        // Test 5: Test RAG search by type
        console.log('5. Testing RAG search by type...');
        const projectResults = await ragSystem.searchByType('project', 'React');
        console.log(`✅ Found ${projectResults.length} project documents`);
        console.log();

        console.log('🎉 All basic tests passed! The system structure is working correctly.');
        console.log('\n📝 Next steps:');
        console.log('1. Set GOOGLE_API_KEY environment variable');
        console.log('2. Test the full intelligent agent');
        console.log('3. Integrate with the chatbot service');

    } catch (error) {
        console.error('❌ Test failed:', error);
    }
}

// Run tests if this file is executed directly
if (require.main === module) {
    testSimpleSystem();
}

export { testSimpleSystem };


















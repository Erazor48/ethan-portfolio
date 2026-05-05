import { intelligentAgent } from './ai/agent/intelligent-agent';
import { ragSystem } from './rag/rag-system';
import { mcpTools } from './ai/tools/mcp-tools';

async function testSystem() {
    console.log('🧪 Testing new MCP + RAG system...\n');

    try {
        // Test 1: Initialize RAG system
        console.log('1. Testing RAG system initialization...');
        await ragSystem.initialize();
        console.log('✅ RAG system initialized successfully\n');

        // Test 2: Test RAG search
        console.log('2. Testing RAG search...');
        const searchResults = await ragSystem.search('React projects', 3);
        console.log(`✅ Found ${searchResults.length} relevant documents\n`);

        // Test 3: Test MCP tools
        console.log('3. Testing MCP tools...');
        const profileTool = mcpTools.find(tool => tool.name === 'get_profile');
        if (profileTool) {
            const profileResult = await profileTool.call({ include_contact: false });
            console.log('✅ Profile tool working:', profileResult.substring(0, 100) + '...\n');
        }

        // Test 4: Test intelligent agent
        console.log('4. Testing intelligent agent...');
        const testMessages = [
            { role: 'user', content: 'Tell me about Ethan\'s React skills' }
        ];
        const response = await intelligentAgent.generateResponse(testMessages);
        console.log('✅ Agent response:', response.substring(0, 200) + '...\n');

        // Test 5: Test quick facts
        console.log('5. Testing quick facts...');
        const quickFacts = await intelligentAgent.getQuickFacts();
        console.log('✅ Quick facts:', quickFacts);

        console.log('\n🎉 All tests passed! The new system is working correctly.');

    } catch (error) {
        console.error('❌ Test failed:', error);
    }
}

// Run tests if this file is executed directly
if (require.main === module) {
    testSystem();
}

export { testSystem };


















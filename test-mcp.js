// Test script pour vérifier le système MCP
const { MCPSystem } = require('./lib/ai/mcp-system.ts');

async function testMCPSystem() {
  console.log('🧪 Testing MCP System...\n');
  
  const mcp = new MCPSystem();
  
  const testMessages = [
    "What are Ethan's skills?",
    "Tell me about Ethan's projects",
    "What's Ethan's GitHub profile?",
    "How can I contact Ethan?",
    "Show me Ethan's experience",
    "__ETHAN_SECRET_ANSWER_42__ hello", // Test clé secrète
    "Hello, how are you?"
  ];
  
  for (const message of testMessages) {
    console.log(`📝 Testing: "${message}"`);
    
    try {
      const response = await mcp.processMessage([
        { role: 'user', content: message }
      ]);
      
      console.log(`✅ Response: ${response.message.substring(0, 100)}...`);
      console.log(`🔧 Tools used: ${response.tools_used.join(', ')}`);
      console.log(`🎯 Confidence: ${response.confidence}`);
      console.log('---\n');
    } catch (error) {
      console.log(`❌ Error: ${error.message}\n`);
    }
  }
}

testMCPSystem().catch(console.error); 
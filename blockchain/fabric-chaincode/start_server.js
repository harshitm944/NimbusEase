const { Shim } = require('fabric-shim');
const { SecureFileRegistry } = require('./dist/fileRegistry');

async function main() {
    console.log('--- FORCING SERVER START ---');
    const contract = new SecureFileRegistry();

    // The bridge object that the Shim expects
    const bridge = {
        Init: async (stub) => {
            console.log('Chaincode Init called');
            return Shim.success(Buffer.from('Initialized Successfully'));
        },
        Invoke: async (stub) => {
            const { fcn, params } = stub.getFunctionAndParameters();
            console.log(`Calling method: ${fcn} with params: ${params}`);
            
            try {
                // 1. Call the function
                const result = await contract[fcn](stub, ...params);
                
                // 2. Safely handle the result (ensure it's a string or Buffer)
                const payload = result ? JSON.stringify(result) : `Success calling ${fcn}`;
                
                console.log(`Method ${fcn} executed successfully.`);
                return Shim.success(Buffer.from(payload));
            } catch (err) {
                console.error(`Error in ${fcn}:`, err);
                return Shim.error(err.message || 'Unknown error occurred');
            }
        }
    };

    const ccid = 'secure-file-registry:fc2fbf80579df2c535888482f37fe86cbe927d841ee51a2284d2b3f52ffdecdf';
    const server = Shim.server(bridge, {
        ccid: ccid,
        address: '0.0.0.0:9999',
        tlsProps: null
    });

    console.log('Server is starting...');
    await server.start();
    console.log('SUCCESS: Server is now listening and READY');
}

main().catch(err => {
    console.error('FAILED TO START:');
    console.error(err);
});
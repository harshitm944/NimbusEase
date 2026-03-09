import { Wallets, X509Identity } from 'fabric-network';
import FabricCAServices from 'fabric-ca-client';
import * as path from 'path';
import * as fs from 'fs';

async function main() {
    try {
        console.log('Starting Fabric CA Enrollment Process...');

        // 1. Point to your specific Fabric test-network connection profile
        const ccpPath = path.resolve(
            process.cwd(),
            '..',
            '..',
            'fabric-samples',
            'test-network',
            'organizations',
            'peerOrganizations',
            'org1.example.com',
            'connection-org1.json'
        );

        if (!fs.existsSync(ccpPath)) {
            console.error(`\n❌ Error: Could not find connection profile at: ${ccpPath}`);
                         console.error('Make sure you are running this from the backend folder!');            process.exit(1);
        }

        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // 2. Connect to the Org1 Certificate Authority (CA)
        const caInfo = ccp.certificateAuthorities['ca.org1.example.com'];
        const caTLSCACerts = caInfo.tlsCACerts.pem;
        const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);

        // 3. Create a local 'wallet' folder to store the keys
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`✅ Wallet path set to: ${walletPath}`);

        // --- ENROLL ADMIN ---
        const adminIdentity = await wallet.get('admin');
        if (!adminIdentity) {
            console.log('Enrolling Admin user...');
            const enrollment = await ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });
            const x509Identity: X509Identity = {
                credentials: {
                    certificate: enrollment.certificate,
                    privateKey: enrollment.key.toBytes(),
                },
                mspId: 'Org1MSP',
                type: 'X.509',
            };
            await wallet.put('admin', x509Identity);
            console.log('✅ Successfully enrolled "admin" and added to wallet.');
        } else {
            console.log('✅ Admin already exists in wallet.');
        }

        // --- REGISTER & ENROLL APPUSER ---
        const userIdentity = await wallet.get('appUser');
        if (userIdentity) {
            console.log('✅ "appUser" already exists in the wallet.');
            return;
        }

        console.log('Registering "appUser"...');
        const adminIdentityForReg = await wallet.get('admin');
        const provider = wallet.getProviderRegistry().getProvider(adminIdentityForReg.type);
        const adminUser = await provider.getUserContext(adminIdentityForReg, 'admin');

        const secret = await ca.register({
            affiliation: 'org1.department1',
            enrollmentID: 'appUser',
            role: 'client'
        }, adminUser);

        console.log('Enrolling "appUser"...');
        const enrollment = await ca.enroll({
            enrollmentID: 'appUser',
            enrollmentSecret: secret
        });

        const x509Identity: X509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: 'Org1MSP',
            type: 'X.509',
        };
        await wallet.put('appUser', x509Identity);
        console.log('🎉 Successfully generated keys for "appUser" and saved to wallet!');

    } catch (error) {
        console.error(`\n❌ Failed to run script: ${error}`);
        process.exit(1);
    }
}

main();
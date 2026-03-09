Write-Host "Starting setup-full-fabric.ps1 script..."

# Full Setup Script for Hyperledger Fabric and Backend Connection
Write-Host "Starting Full Fabric Setup..."

# 1. Run the base Fabric setup
.\setup-fabric.ps1

# 2. Copy the Connection Profile to the root (where backend expects it)
Write-Host "Copying connection profile..."
$CP_PATH = "$PSScriptRoot/../infrastructure/fabric/samples/test-network/organizations/peerOrganizations/org1.example.com/connection-org1.json"

If (Test-Path -Path $CP_PATH -PathType Leaf) {
    Copy-Item $CP_PATH -Destination "$PSScriptRoot/../connection-org1.json"
    Write-Host "Connection profile copied to root."
} Else {
    Write-Host "Error: Connection profile not found. Did the network start correctly?"
    exit 1
}

# 3. Setup Backend Environment
Write-Host "Configuring backend environment..."
Set-Location "$PSScriptRoot/../backend"

# Create .env if it doesn't exist
If (-Not (Test-Path -Path ".env" -PathType Leaf)) {
    Copy-Item ".env.example" -Destination ".env"
    Write-Host "Created .env from .env.example"
}

# 4. Force Install backend dependencies
Write-Host "Installing backend dependencies (with legacy-peer-deps)..."
Remove-Item -Recurse -Force node_modules, package-lock.json -ErrorAction SilentlyContinue
npm install --legacy-peer-deps

# 5. Enroll Admin/User
Write-Host "Enrolling identities..."
New-Item -ItemType Directory -Force -Path "wallet"
npx ts-node src/scripts/enroll-admin.ts

Write-Host "Setup Complete!"
Write-Host "If you saw Broken Pipe errors, please RESTART Docker Desktop."
Write-Host "To start the backend, run: cd backend; npm run start:dev"

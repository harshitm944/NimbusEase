import { AiEngineService } from '../ai-engine/ai-engine.service';
import { DataSimulatorService } from '../ai-engine/data-simulator.service';
import { SecurityAgentService } from '../ai-engine/security-agent.service';
import { RedisMockService } from '../ai-engine/redis-mock.service';
import { Logger } from '@nestjs/common';

async function trainModel() {
  const logger = new Logger('ModelTraining');
  logger.log('🏋️ Starting AI Engine Model Training...');

  // Initialize necessary services
  const redis = new RedisMockService();
  const securityAgent = new SecurityAgentService();
  const abTesting = { getVariant: () => 'A', logComparison: async () => {} } as any;
  const aiEngine = new AiEngineService(securityAgent, redis, abTesting);
  const simulator = new DataSimulatorService();

  // 1. GENERATE TRAINING DATA
  // We generate 5000 logs with a 20% anomaly ratio for a balanced dataset
  logger.log('📊 Generating 5,000 training samples...');
  const trainingData = simulator.generateLogs(5000, 0.2); 

  // 2. TRAIN THE MODEL
  logger.log('🧠 Training TensorFlow.js model (30 epochs)...');
  const start = Date.now();
  await aiEngine.trainModel(trainingData);
  const duration = (Date.now() - start) / 1000;

  logger.log(`✅ Training complete in ${duration.toFixed(2)}s.`);

  // 3. VERIFY MODEL ACCURACY
  logger.log('🔍 Verifying model accuracy on new test data...');
  const testData = simulator.generateLogs(100, 0.5); // 50/50 split for testing
  let correct = 0;

  for (const log of testData) {
    const prediction = await aiEngine.predict(log);
    const isAnomaly = log.isAnomaly === 1;
    if (prediction.isAnomaly === isAnomaly) {
      correct++;
    }
  }

  logger.log(`📈 Accuracy: ${correct}%`);
  logger.log('💾 Model saved to backend/models/security-model');
}

trainModel().catch(err => {
  console.error('❌ Training Failed:', err);
  process.exit(1);
});

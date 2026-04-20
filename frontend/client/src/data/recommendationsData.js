/**
 * data/recommendationsData.js
 * Fake posts/projects data used by the RecommendationPage.
 * Each entry mirrors the model's output schema:
 *   post_id, title, domain, collaboration_type, required_skills (array of strings)
 */

const RECOMMENDATIONS_DATA = [
  {
    post_id: 0,
    title: "Developing AI-Powered Chatbots",
    domain: "Artificial Intelligence",
    collaboration_type: "both",
    required_skills: ["python", "machine learning", "nlp", "tensorflow", "dialogue systems"],
  },
  {
    post_id: 1,
    title: "Deep Learning for Medical Image Segmentation",
    domain: "Biomedical Engineering",
    collaboration_type: "researcher",
    required_skills: ["python", "pytorch", "deep learning", "image processing", "computer vision"],
  },
  {
    post_id: 2,
    title: "Reinforcement Learning for Autonomous Drones",
    domain: "Robotics",
    collaboration_type: "student",
    required_skills: ["python", "reinforcement learning", "control systems", "ros", "tensorflow"],
  },
  {
    post_id: 3,
    title: "Natural Language Processing for Arabic Sentiment Analysis",
    domain: "Natural Language Processing",
    collaboration_type: "both",
    required_skills: ["python", "nlp", "bert", "arabic text", "transformers"],
  },
  {
    post_id: 4,
    title: "Graph Neural Networks for Drug Discovery",
    domain: "Bioinformatics",
    collaboration_type: "researcher",
    required_skills: ["python", "graph neural networks", "pytorch", "cheminformatics", "molecular biology"],
  },
  {
    post_id: 5,
    title: "Federated Learning for Privacy-Preserving Healthcare",
    domain: "Machine Learning",
    collaboration_type: "researcher",
    required_skills: ["python", "federated learning", "privacy", "tensorflow", "machine learning"],
  },
  {
    post_id: 6,
    title: "Computer Vision for Smart Traffic Management",
    domain: "Computer Vision",
    collaboration_type: "student",
    required_skills: ["python", "opencv", "yolo", "computer vision", "deep learning"],
  },
  {
    post_id: 7,
    title: "Explainable AI for Financial Risk Assessment",
    domain: "Financial Technology",
    collaboration_type: "both",
    required_skills: ["python", "xai", "machine learning", "scikit-learn", "statistics"],
  },
  {
    post_id: 8,
    title: "Time Series Forecasting with Transformer Models",
    domain: "Data Science",
    collaboration_type: "student",
    required_skills: ["python", "transformers", "time series", "pytorch", "statistics"],
  },
  {
    post_id: 9,
    title: "Multi-Agent Systems for Smart Grid Optimization",
    domain: "Energy Systems",
    collaboration_type: "researcher",
    required_skills: ["python", "multi-agent systems", "optimization", "reinforcement learning", "simulation"],
  },
  {
    post_id: 10,
    title: "Speech Emotion Recognition with Deep Learning",
    domain: "Speech Processing",
    collaboration_type: "student",
    required_skills: ["python", "deep learning", "audio processing", "pytorch", "signal processing"],
  },
  {
    post_id: 11,
    title: "Knowledge Graph Completion for Scientific Literature",
    domain: "Knowledge Representation",
    collaboration_type: "researcher",
    required_skills: ["python", "knowledge graphs", "nlp", "sparql", "machine learning"],
  },
  {
    post_id: 12,
    title: "Adversarial Robustness in Neural Networks",
    domain: "Machine Learning Security",
    collaboration_type: "both",
    required_skills: ["python", "adversarial attacks", "tensorflow", "pytorch", "deep learning"],
  },
  {
    post_id: 13,
    title: "Generative Models for Synthetic Data Augmentation",
    domain: "Generative AI",
    collaboration_type: "student",
    required_skills: ["python", "gans", "vae", "pytorch", "image generation"],
  },
  {
    post_id: 14,
    title: "Quantum Machine Learning Algorithms",
    domain: "Quantum Computing",
    collaboration_type: "researcher",
    required_skills: ["python", "quantum computing", "qiskit", "machine learning", "linear algebra"],
  },
];

export default RECOMMENDATIONS_DATA;
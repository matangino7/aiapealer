# AI Exam Appealer Generator

An Angular-based application that helps students generate professional exam appeals using AI and OCR technology.

## Features

- User Authentication (Google, Email/Password)
- Exam Image Upload (JPG, PNG, PDF)
- OCR Text Extraction
- AI-Powered Appeal Generation
- Appeal History Management
- Modern, Responsive UI

## Tech Stack

- Angular 16
- Firebase (Authentication, Firestore, Storage)
- Tesseract.js (OCR)
- OpenAI API (GPT-4)
- TailwindCSS
- Angular Material

## Prerequisites

- Node.js (v18.19.1 or later)
- npm (v8.0.0 or later)
- Firebase Account
- OpenAI API Key

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ai-exam-appealer.git
   cd ai-exam-appealer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Firebase:
   - Create a new Firebase project
   - Enable Authentication (Google, Email/Password)
   - Create a Firestore database
   - Set up Storage
   - Copy your Firebase configuration to `src/environments/environment.ts`

4. Configure OpenAI:
   - Get your OpenAI API key
   - Add it to `src/environments/environment.ts`

5. Start the development server:
   ```bash
   ng serve
   ```

## Environment Configuration

Update `src/environments/environment.ts` with your credentials:

```typescript
export const environment = {
  production: false,
  firebase: {
    apiKey: 'YOUR_API_KEY',
    authDomain: 'YOUR_AUTH_DOMAIN',
    projectId: 'YOUR_PROJECT_ID',
    storageBucket: 'YOUR_STORAGE_BUCKET',
    messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
    appId: 'YOUR_APP_ID'
  },
  openai: {
    apiKey: 'YOUR_OPENAI_API_KEY'
  }
};
```

## Project Structure

```
src/
├── app/
│   ├── core/
│   │   ├── guards/
│   │   ├── models/
│   │   └── services/
│   ├── features/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   └── exam-appeal/
│   └── shared/
├── environments/
└── assets/
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OpenAI for providing the GPT-4 API
- Tesseract.js for OCR capabilities
- Firebase for backend services
- Angular team for the amazing framework 
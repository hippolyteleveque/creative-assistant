# Creative Assistant

A powerful AI-powered creative assistant that helps you generate and manage assets (images and videos) through natural language conversations.


## Installation

1. **Clone the repository**
   ```bash
   git clone git@github.com:hippolyteleveque/creative-assistant.git 
   cd creative-assistant
   ```

2. **Set up environment variables**
   ```bash
   # Rename .env.example to .env and add your API tokens
   cp .env.example .env
   ```
   
   Edit the `.env` file and add your API tokens:
   ```env
   REPLICATE_API_TOKEN=your_replicate_api_token_here
   REPLICATE_IMAGE_MODEL_ID=your_image_model_id_here
   REPLICATE_VIDEO_MODEL_ID=your_video_model_id_here
   OPENAI_API_KEY=your_openai_api_key_here
   DATABASE_URL=your_database_url_here
   ```

3. **Install dependencies**
   ```bash
   pnpm install
   ```

4. **Set up the database**
   ```bash
   npx prisma migrate dev
   ```

5. **Build the application**
   ```bash
   pnpm run build
   ```

6. **Start the development server**
   ```bash
   pnpm run start
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### Chat with the Assistant

- **Generate Assets**: Chat with the creative assistant and generate assets if required 
- **Natural Language**: Describe what you want in plain English
- **Multiple Formats**: Both images and videos are supported

### Asset Management

- **Discard Assets**: Click the discard icon on any asset that's not relevant
- **Save Assets**: Click the save icon on relevant assets to store them for later
- **Retrieve Saved Assets**: Access your saved assets on the dedicated assets page

### Image Iteration

- **Select for Iteration**: Choose ONE image (images only) to iterate upon
- **Refine Results**: Make adjustments and improvements to your selected image

### Conversation Management

- **Reset Conversation**: Click the reset button to start a fresh conversation
- **Clear History**: Start over with a clean slate


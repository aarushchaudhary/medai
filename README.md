# MedAI - AI Assistant for Medical Needs

MedAI is a web-based, AI-powered chat application designed to assist with medical-related queries. It can understand and respond to text-based questions, as well as analyze images of medicine labels, food labels, and doctor's prescriptions. The application provides features for managing chat history, including saving, pinning, renaming, and deleting conversations.

## Features

  * **AI-Powered Chat:** Engage in a conversation with an AI assistant for your medical questions.
  * **Image Analysis:** Upload images of medical documents, and the AI will provide a concise summary.
  * **Web Scraping:** The application scrapes information from CDSCO and PubMed to provide contextually relevant answers.
  * **Chat History:** Your conversations are saved and can be revisited at any time.
  * **Chat Management:** Pin your important chats, rename them for better organization, or delete them when no longer needed.
  * **Data Encryption:** All chat messages are encrypted to ensure your privacy.

## Tech Stack

### Frontend

  * React
  * Tailwind CSS
  * React Icons
  * Axios
  * React Markdown

### Backend

  * Node.js
  * Express
  * MongoDB
  * Mongoose
  * Google Generative AI
  * Cheerio (for web scraping)
  * Multer (for file uploads)
  * Crypto-JS (for encryption)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

  * Node.js and npm
  * MongoDB

### Installation

1.  **Clone the repository:**

    ```sh
    git clone https://github.com/medai/medai.git
    ```

2.  **Client Setup:**

    ```sh
    cd client
    npm install
    npm start
    ```

3.  **Server Setup:**

    ```sh
    cd server
    npm install
    ```

4.  Create a `.env` file in the `server` directory and add the following environment variables:

    ```
    MONGO_URI=<YOUR_MONGODB_CONNECTION_STRING>
    GOOGLE_API_KEY=<YOUR_GOOGLE_API_KEY>
    ENCRYPTION_SECRET_KEY=<YOUR_ENCRYPTION_SECRET_KEY>
    ```

5.  **Start the server:**

    ```sh
    npm start
    ```

## API Endpoints

The following are the available API endpoints for the server:

  * `POST /api/chat/send`: Send a text-based message to the AI.
  * `POST /api/chat/upload`: Upload an image for analysis, along with an optional message.
  * `POST /api/chat/save`: Save the current chat session to the database.
  * `GET /api/chat/history`: Retrieve the list of all saved chats.
  * `GET /api/chat/:id`: Fetch a specific chat by its ID.
  * `PUT /api/chat/:id`: Update a chat's title or pinned status.
  * `DELETE /api/chat/:id`: Delete a chat from the history.
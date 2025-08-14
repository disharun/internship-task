# Custom Form Builder

A modern, feature-rich form builder built with the MERN stack (MongoDB, Express.js, React, Node.js) and Tailwind CSS. This application allows users to create custom forms with three unique question types: Categorize, Cloze, and Comprehension.

## Features

### 🎯 Question Types

- **Categorize**: Group items into predefined categories
- **Cloze**: Fill-in-the-blank questions with passages
- **Comprehension**: Reading passages with multiple-choice questions

### 🖼️ Media Support

- Add images to individual questions
- Upload header images for forms
- Drag and drop image uploads

### 🎨 Modern UI/UX

- Clean, responsive design with Tailwind CSS
- Intuitive form builder interface
- Real-time preview functionality
- Mobile-friendly responsive design

### 📊 Form Management

- Create, edit, and delete forms
- Save drafts and publish forms
- View form responses and analytics
- Export responses to CSV

### 🔗 Sharing & Distribution

- Generate shareable form links
- Public form filling interface
- Response collection and storage

## Technology Stack

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Multer** - File upload handling

### Frontend

- **React** - UI library
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **Lucide React** - Icon library

## Prerequisites

Before running this application, make sure you have the following installed:

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd custom-form-builder
```

### 2. Install Dependencies

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
MONGODB_URI=mongodb://localhost:27017/form-builder
PORT=5000
NODE_ENV=development
```

### 4. Start the Application

#### Development Mode

```bash
# Start backend server (from root directory)
npm run dev

# Start frontend (from root directory)
npm run client
```

#### Production Mode

```bash
# Build and start the application
npm run build
npm start
```

The application will be available at:

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Project Structure

```
custom-form-builder/
├── client/                 # React frontend
│   ├── public/            # Static files
│   ├── src/               # Source code
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── App.js         # Main app component
│   │   └── index.js       # Entry point
│   ├── package.json       # Frontend dependencies
│   └── tailwind.config.js # Tailwind configuration
├── models/                 # MongoDB schemas
│   ├── Form.js            # Form model
│   └── Response.js        # Response model
├── routes/                 # API routes
│   ├── forms.js           # Form CRUD operations
│   └── responses.js       # Response handling
├── uploads/                # File uploads directory
├── server.js              # Express server
├── package.json           # Backend dependencies
└── README.md              # Project documentation
```

## API Endpoints

### Forms

- `GET /api/forms` - Get all forms
- `GET /api/forms/:id` - Get specific form
- `POST /api/forms` - Create new form
- `PUT /api/forms/:id` - Update form
- `DELETE /api/forms/:id` - Delete form
- `POST /api/forms/:id/header-image` - Upload header image
- `POST /api/forms/:id/questions/:index/image` - Upload question image

### Responses

- `GET /api/responses/form/:formId` - Get responses for a form
- `GET /api/responses/:id` - Get specific response
- `POST /api/responses` - Submit form response
- `DELETE /api/responses/:id` - Delete response

## Usage

### Creating a Form

1. Navigate to the form builder
2. Add a title and description
3. Upload an optional header image
4. Add questions using the three question types
5. Configure question settings and options
6. Save as draft or publish immediately

### Question Types

#### Categorize

- Define categories
- Add items to be categorized
- Users drag items into appropriate categories

#### Cloze

- Write a passage with blanks (use `___` to indicate blanks)
- Define correct answers for each blank
- Users fill in the blanks

#### Comprehension

- Write a reading passage
- Add multiple-choice questions
- Set correct answers for scoring

### Sharing Forms

- Published forms generate shareable links
- Users can fill out forms via the public link
- Responses are stored in the database

### Viewing Responses

- Access response analytics in the dashboard
- View individual response details
- Export responses to CSV format

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by modern form builders like Typeform and Paperform
- Built with modern web technologies and best practices
- Designed for educational and professional use cases

## Support

If you encounter any issues or have questions:

1. Check the existing issues in the repository
2. Create a new issue with detailed information
3. Contact the development team

---

**Happy Form Building! 🎉**

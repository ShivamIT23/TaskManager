# TaskManager

TaskManager is a web-based application designed to help you manage tasks efficiently with features like real-time notifications, task updates, and approvals. It provides an intuitive interface to track and manage tasks, making it ideal for teams and individuals to organize their workflow.

## Features

- **Task Creation & Management**: Easily create and manage tasks with details like title, description, priority, and deadlines.
- **Task Update/Delete**: Edit or remove tasks whenever necessary, with full update history.
- **Notifications**: Get notified via email and WebSocket for task updates or approvals.
- **Real-Time Updates**: Stay updated with real-time task status changes and approvals through WebSocket connections.
- **User Authentication**: Secure login and user management.
- **Task Assignment**: Assign tasks to different users and track progress.
- **Task Approval Workflow**: Set up task approvals to ensure tasks meet requirements before being finalized.

## Tech Stack

- **Frontend**: React.js, Zustand (for state management), CSS/SCSS, WebSockets
- **Backend**: Node.js, Express.js, Socket.IO
- **Database**: MongoDB (or any other database of choice)
- **Authentication**: JWT (JSON Web Token) for secure user authentication
- **Notifications**: Email (Nodemailer) & WebSocket (Socket.IO)

## Installation

To run the TaskManager project locally, follow these steps:

### Prerequisites
Make sure you have Node.js installed on your machine.

1. **Clone the repository**

```bash
git clone https://github.com/ShivamIT23/TaskManager.git
cd TaskManager
```

2. **Install dependencies**

For the backend:

```bash
cd backend
npm install
```

For the frontend:

```bash
cd frontend
npm install
```

### Environment Variables

You will need to configure the following environment variables:

#### Backend Environment Variables
- `PORT`: The port for the backend server. Default is `5000`.
- `MONGO_URI`: MongoDB connection string.
- `JWT_SECRET`: Secret key for JWT authentication.
- `EMAIL_USER`: The email address used for sending notifications.
- `EMAIL_PASS`: The email password (or app-specific password if using services like Gmail).
- `FRONTEND_URL`: The URL for the frontend application.

#### Frontend Environment Variables
- `NEXT_PUBLIC_BACKEND_SERVER`: The backend server URL, which should be `http://localhost:5000` for local development.

### Running the Project

1. **Start the backend server**

```bash
cd backend
npm start
```

2. **Start the frontend development server**

```bash
cd frontend
npm start
```

The app should now be running at `http://localhost:3000`.

## Usage

Once the application is running, you can:

- Register a new user or log in.
- Create new tasks, assign them, and set deadlines.
- Update or delete tasks as needed.
- Receive real-time task updates and notifications.

## Contribution

Feel free to fork this repository and create pull requests with improvements, bug fixes, or new features.

1. Fork the repository
2. Create a new branch (`git checkout -b feature-xyz`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature-xyz`)
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Thanks to the community for contributing ideas and improvements!
- Special thanks to the developers of [Socket.IO](https://socket.io/) and [React](https://reactjs.org/).



# 📄 Disclaimer
This project was developed as a take-home assignment for a software developer position.
It is intended solely for evaluation purposes by the hiring team.

No permission is granted to use this codebase, in part or in full, for commercial or production purposes without the explicit consent of the author.

If you would like to build upon or reuse this project beyond evaluation, please contact me directly.
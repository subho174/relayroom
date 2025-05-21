import connectDB from '../../../db/dbConnect';
import User from "../../../model/user.model";
import ChatInterface from './ChatInterfaceClient';

const ChatInterfaceServer =async () => {
 try {
    await connectDB();
    // getAllUsers
    const users = await User.find({}).select("-refreshToken");
    return <ChatInterface users={JSON.parse(JSON.stringify(users))} />
 } catch (error) {
    throw new Error('Some error occured', error)
 }
}

export default ChatInterfaceServer;
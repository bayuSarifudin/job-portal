import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import Login from './Login';
import Signup from './Signup';

const Auth = () => {
  return (
    <Tabs defaultValue="login" className="w-full sm:w-[400px] min-h-[400px] h-max my-[50px] sm:my-[100px] px-4">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login">Login</TabsTrigger>
        <TabsTrigger value="signup">Signup</TabsTrigger>
      </TabsList>
      <TabsContent value="login">
        <Login />
      </TabsContent>
      <TabsContent value="signup">
        <Signup />
      </TabsContent>
    </Tabs>
  );
};

export default Auth;
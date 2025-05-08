import { AuthProvider } from "./authContextConfig";
import { DialogProvider } from "./dialogContext";

const AllContextProvider = ({ children }) => {
  return (
    <AuthProvider>
      <DialogProvider>{children}</DialogProvider>
    </AuthProvider>
  );
};

export default AllContextProvider;

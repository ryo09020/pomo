const Login = ({ history }) => {
    const { login } = useContext(AuthContext);
    //AuthContextからlogin関数を受け取る
  
    const handleSubmit = event => {
      event.preventDefault();
      const { email, password } = event.target.elements;
      login(email.value, password.value, history);
    };
}

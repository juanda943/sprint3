import React, { Component } from "react";

export default class Reset extends Component {
    
  // Estados para el backend
  constructor(props) {
        super(props);
        this.state = {
          email: "",
        };
        this.handleSubmit = this.handleSubmit.bind(this);
      }
      handleSubmit(e) {
        e.preventDefault();
        const { email} = this.state;
        console.log(email);
        // Modificar por recuperar el email
        fetch("http://localhost:5000/forgot-password", {
          method: "POST",
          crossDomain: true,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify({
            email,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log(data, "userRegister");
            //Colocar alert - Con el backend
            alert(data.status);

          });
      }
      render() {
        return (
          <form onSubmit={this.handleSubmit}>
            <h3>Recuperar Contraseña</h3>
    
            <div className="mb-3">
              <label>Correo</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter email"
                onChange={(e) => this.setState({ email: e.target.value })}
              />
            </div>
    
   
            <div className="d-grid">
              <button type="submit" className="btn btn-primary">
                Enviar!!
              </button>
            </div>
            <p className="forgot-password text-right">
              <a href="/sign-in">Sign In</a>
            </p>
          </form>
        );
      }
}

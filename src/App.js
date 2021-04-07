import React from 'react';
import Welcome from "./component/Welcome";
import './App.css';
import {Container, Row, Col} from 'react-bootstrap';
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";

function App() {
    const marginTop = {
        marginTop: "20px"
    };

  return (
      <Router>
          <Container>
              <Row>
                  <Col lg={12} style={marginTop}>
                      <Switch>
                          <Route path={"/"} exact component = {Welcome}/>
                      </Switch>
                  </Col>
              </Row>
          </Container>
      </Router>
  );
}

export default App;

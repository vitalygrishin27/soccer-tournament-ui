import React, {Component} from "react";
import {Button, Card, Jumbotron} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import logo from '../soccer-tournament.png';

export default class Welcome extends Component {

    constructor(props) {
        super(props);
        this.state = {
            title: "Soccer tournament",
        };
    }

    componentDidMount() {
        //localStorage.setItem("host", "https://kids-championchip-2012-service.herokuapp.com/ui/")
         localStorage.setItem("soccer-tournament-host", "http://localhost:8093/")
    }

    render() {
        const {title} = this.state;
        return (
            <Jumbotron className="bg-transparent text-white">
                <div className="App">
                    <header className="App-header">
                        <img src={logo} className="App-logo" alt="logo" />
                        <h5>
                            Developed by Vitaliy Grishin
                        </h5>
                    </header>
                </div>
                <Card className={"text-white"} style={{backgroundColor: 'transparent', textAlign: 'center', border:'none'}}>
                    <Card.Body>
                        {'  '}<Button size="bg" variant="primary" type="button"
                                      style={{"display": "inline"}}>
                        <FontAwesomeIcon icon={faPlus}/> Create new tournament
                    </Button>
                    </Card.Body>
                </Card>
            </Jumbotron>
        );
    }
}

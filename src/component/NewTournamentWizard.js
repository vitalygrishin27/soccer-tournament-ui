import React, {Component} from 'react';
import CountGoalsForm from "./CountGoalsForm";
import PlayersGoalsForm from "./PlayersGoalsForm";
import axios from "axios";
import CountYellowCardsForm from "./CountYellowCardsForm";
import PlayersYellowCardsForm from "./PlayersYellowCardsForm";
import CountRedCardsForm from "./CountRedCardsForm";
import PlayersRedCardsForm from "./PlayersRedCardsForm";
import Summary from "./Summary";

export default class NewTournamentWizard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            isErrorLoading: false,
            step: 1,
            tournamentId: 0,
            countTeams: 0,
            countGroups: 0,
            teamsList: [],
        }
    }

    componentDidMount() {
        const tournamentId = +this.props.match.params.tournamentId;
        this.setState({
            step: 1,
            tournamentId: tournamentId,
        });
        this.getTeamsListForTournament(tournamentId);
    }

    getTeamsListForTournament = (tournamentId) => {
        this.setState({
            isLoading: true,
            isErrorLoading: false,
        });
        axios.get(localStorage.getItem("host") + "tournaments/" + tournamentId + "/teams")
            //  axios.get("http://localhost:8092/ui/standings")
            .then(response => response.data)
            .then((data) => {
                console.log(data);
                data.map((list, count) => (
                    count === 0 ?
                        this.setState({
                            teamsList: list,
                        }) :
                        this.setState({
                            teamsList: list,
                        })
                ));
                this.setState({
                    isLoading: false,
                    isErrorLoading: false,
                });
                this.checkIfGameResultAlreadyExists(gameId);
            }).catch(() => {
            this.setState({
                isLoading: false,
                isErrorLoading: true,
            });
        });
    }

    handleChange = input => e => {
        try {
            if (e.target.value >= 0) {
                this.setState({[input]: e.target.value});
            } else {
                this.setState({[input]: 0});
            }
        }catch (e) {
            this.setState({[input]: 0});
        }

    }

    masterCheckBoxChange = () => {
        this.setState({
            isMasterTechnicalWin: !this.state.isMasterTechnicalWin,
        });
        if (!this.state.isMasterTechnicalWin) {
            this.setState({
                isSlaveTechnicalWin: false,
            });
        }
    }

    slaveCheckBoxChange = () => {
        this.setState({
            isSlaveTechnicalWin: !this.state.isSlaveTechnicalWin,
        });
        if (!this.state.isSlaveTechnicalWin) {
            this.setState({
                isMasterTechnicalWin: false,
            });
        }
    }

    nextStep = () => {
        if(this.state.isMasterTechnicalWin || this.state.isSlaveTechnicalWin){
            this.setState({
                step: this.state.step + 6
            });
            return;
        }else{
            this.setState({
                step: this.state.step + 1
            })
        }
        if (this.state.step === 1 && this.state.countMasterGoals == 0 && this.state.countSlaveGoals == 0) {
            this.setState({
                step: 3
            })
        }
        if (this.state.step === 3 && this.state.countMasterYellowCards == 0 && this.state.countSlaveYellowCards == 0) {
            this.setState({
                step: 5
            })
        }
        if (this.state.step === 5 && this.state.countMasterRedCards == 0 && this.state.countSlaveRedCards == 0) {
            this.setState({
                step: 7
            })
        }
    }

    prevStep = () => {
        if(this.state.isMasterTechnicalWin || this.state.isSlaveTechnicalWin){
            this.setState({
                step: this.state.step - 6
            });
            return;
        }else{
            this.setState({
                step: this.state.step - 1
            })
        }
        if (this.state.step === 3 && this.state.countMasterGoals == 0 && this.state.countSlaveGoals == 0) {
            this.setState({
                step: 1
            })
        }
        if (this.state.step === 5 && this.state.countMasterYellowCards == 0 && this.state.countSlaveYellowCards == 0) {
            this.setState({
                step: 3
            })
        }
        if (this.state.step === 7 && this.state.countMasterRedCards == 0 && this.state.countSlaveRedCards == 0) {
            this.setState({
                step: 5
            })
        }
    }

    submitToServer = event => {
        event.preventDefault();
        let data = new FormData();
        data.append('gameId', this.state.gameId);
        data.append('masterTeamName', this.state.masterTeamName);
        data.append('slaveTeamName', this.state.slaveTeamName);
        data.append('countMasterGoals', this.state.countMasterGoals);
        data.append('countSlaveGoals', this.state.countSlaveGoals);
        data.append('masterPlayersGoals', this.state.masterPlayersGoals);
        data.append('slavePlayersGoals', this.state.slavePlayersGoals);
        data.append('countMasterYellowCards', this.state.countMasterYellowCards);
        data.append('countSlaveYellowCards', this.state.countSlaveYellowCards);
        data.append('masterPlayersYellowCards', this.state.masterPlayersYellowCards);
        data.append('slavePlayersYellowCards', this.state.slavePlayersYellowCards);
        data.append('countMasterRedCards', this.state.countMasterRedCards);
        data.append('countSlaveRedCards', this.state.countSlaveRedCards);
        data.append('masterPlayersRedCards', this.state.masterPlayersRedCards);
        data.append('slavePlayersRedCards', this.state.slavePlayersRedCards);
        data.append('isMasterTechnicalWin', this.state.isMasterTechnicalWin);
        data.append('isSlaveTechnicalWin', this.state.isSlaveTechnicalWin);

        console.log("Send POST with: ");
        for (const pair of data.entries()) {
            console.log(pair[0] + ', ' + pair[1]);
        }
        this.setState({blockScreen: true});
        // axios.post("http://localhost:8092/ui/player", data)
        axios.post(localStorage.getItem("host") + "gameResult/" + this.state.gameId, data)
            .then((res) => {
                console.log("RESPONSE RECEIVED: ", res);
                this.setState({"show": true, "error": false, "method": 'post'});
                setTimeout(() => this.setState({"show": false}), 3000);
                document.location.href = "/games";
            })
            .catch((err) => {
                this.setState({"error": true, "show": true, "blockScreen": false});
                setTimeout(() => this.setState({"show": false}), 3000);
                console.log("AXIOS ERROR: ", err);
              alert(err);
            })
    };

    render() {
        const {step} = this.state;
        const {masterPlayersList, slavePlayersList, masterPlayersGoals, slavePlayersGoals, countMasterGoals, countSlaveGoals, countMasterYellowCards, countSlaveYellowCards, countMasterRedCards, countSlaveRedCards, masterPlayersYellowCards, slavePlayersYellowCards, masterPlayersRedCards, slavePlayersRedCards, isMasterTechnicalWin, isSlaveTechnicalWin} = this.state;
        const values = {
            isMasterTechnicalWin,
            isSlaveTechnicalWin,
            masterPlayersList,
            slavePlayersList,
            masterPlayersGoals,
            slavePlayersGoals,
            masterPlayersYellowCards,
            slavePlayersYellowCards,
            countMasterGoals,
            countSlaveGoals,
            countMasterYellowCards,
            countSlaveYellowCards,
            countMasterRedCards,
            countSlaveRedCards,
            masterPlayersRedCards,
            slavePlayersRedCards
        };

        switch (this.state.step) {
            case 1:
                return (
                    <div>
                        <CountGoalsForm nextStep={this.nextStep}
                                        masterTeamName={this.state.masterTeamName}
                                        slaveTeamName={this.state.slaveTeamName}
                                        isMasterTechnicalWin={this.state.isMasterTechnicalWin}
                                        isSlaveTechnicalWin={this.state.isSlaveTechnicalWin}
                                        handleChange={this.handleChange}
                                        masterCheckBoxChange={this.masterCheckBoxChange}
                                        slaveCheckBoxChange={this.slaveCheckBoxChange}
                                        values={values}
                        />
                    </div>
                );
                break;
            case 2:
                return (

                    <PlayersGoalsForm nextStep={this.nextStep}
                                      prevStep={this.prevStep}
                                      masterTeamName={this.state.masterTeamName}
                                      slaveTeamName={this.state.slaveTeamName}
                                      handleChange={this.handleChange}
                                      masterPlayersList={this.state.masterPlayersList}
                                      slavePlayersList={this.state.slavePlayersList}
                                      masterPlayersGoals={this.state.masterPlayersGoals}
                                      slavePlayersGoals={this.state.slavePlayersGoals}
                                      values={values}>
                    </PlayersGoalsForm>
                )
                break;
            case 3:
                return (
                    <CountYellowCardsForm nextStep={this.nextStep}
                                          prevStep={this.prevStep}
                                          masterTeamName={this.state.masterTeamName}
                                          slaveTeamName={this.state.slaveTeamName}
                                          handleChange={this.handleChange}
                                          values={values}>
                    </CountYellowCardsForm>
                )
                break;
            case 4:
                return (
                    <PlayersYellowCardsForm nextStep={this.nextStep}
                                            prevStep={this.prevStep}
                                            masterTeamName={this.state.masterTeamName}
                                            slaveTeamName={this.state.slaveTeamName}
                                            handleChange={this.handleChange}
                                            masterPlayersList={this.state.masterPlayersList}
                                            slavePlayersList={this.state.slavePlayersList}
                                            masterPlayersYellowCards={this.state.masterPlayersYellowCards}
                                            slavePlayersYellowCards={this.state.slavePlayersYellowCards}
                                            values={values}>
                    </PlayersYellowCardsForm>
                )
                break;
            case 5:
                return (
                    <CountRedCardsForm nextStep={this.nextStep}
                                       prevStep={this.prevStep}
                                       masterTeamName={this.state.masterTeamName}
                                       slaveTeamName={this.state.slaveTeamName}
                                       handleChange={this.handleChange}
                                       values={values}>
                    </CountRedCardsForm>
                )
                break;
            case 6:
                return (
                    <PlayersRedCardsForm nextStep={this.nextStep}
                                         prevStep={this.prevStep}
                                         masterTeamName={this.state.masterTeamName}
                                         slaveTeamName={this.state.slaveTeamName}
                                         handleChange={this.handleChange}
                                         masterPlayersList={this.state.masterPlayersList}
                                         slavePlayersList={this.state.slavePlayersList}
                                         masterPlayersRedCards={this.state.masterPlayersRedCards}
                                         slavePlayersRedCards={this.state.slavePlayersRedCards}
                                         values={values}>
                    </PlayersRedCardsForm>
                )
                break;
            case 7:
                return (
                    <Summary nextStep={this.nextStep}
                             prevStep={this.prevStep}
                             gameId={this.state.gameId}
                             submitToServer={this.submitToServer}
                             countMasterGoals={this.state.countMasterGoals}
                             countSlaveGoals={this.state.countSlaveGoals}
                             countMasterYellowCards={this.state.countMasterYellowCards}
                             countSlaveYellowCards={this.state.countSlaveYellowCards}
                             countMasterRedCards={this.state.countMasterRedCards}
                             countSlaveRedCards={this.state.countSlaveRedCards}
                             masterPlayersList={this.state.masterPlayersList}
                             slavePlayersList={this.state.slavePlayersList}
                             masterPlayersGoals={this.state.masterPlayersGoals}
                             slavePlayersGoals={this.state.slavePlayersGoals}
                             masterPlayersYellowCards={this.state.masterPlayersYellowCards}
                             slavePlayersYellowCards={this.state.slavePlayersYellowCards}
                             masterPlayersRedCards={this.state.masterPlayersRedCards}
                             slavePlayersRedCards={this.state.slavePlayersRedCards}
                             masterTeamName={this.state.masterTeamName}
                             slaveTeamName={this.state.slaveTeamName}
                             isMasterTechnicalWin={this.state.isMasterTechnicalWin}
                             isSlaveTechnicalWin={this.state.isSlaveTechnicalWin}>
                    </Summary>
                )
                break;
        }
    }

}

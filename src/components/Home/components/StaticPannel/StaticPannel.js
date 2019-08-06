import React, { Component } from 'react';
import './StaticPannel.css';
import UpdateIcon from './../../../../icons/update-blue-icon.png';
import CancelIcon from './../../../../icons/cancel-dark-icon.png';

class StaticPannel extends Component {
  constructor(props) {
    super(props);
    const { displayedJourney } = this.props;
    this.state = {
      budget: displayedJourney[0].budget,
      isEditing: ''
    }
  }

  onBudgetChange = (event) => {
    this.setState({ budget: event.target.value })
  };

  handleEditing = (target) => {
    this.setState({ isEditing: target })
  };

  handleEnter = (event) => {
    const { journeyId } = this.props;
    if(event.key === 'Enter') {
      fetch(`http://localhost:3000/journeys_budgets/${journeyId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          budget: this.state.budget
        })
      })
      .then(response => response.json())
      .then(journey=> {
        this.props.handleBudgetsChange(journey, journeyId);
      })
      .catch(err => alert('unable to edit budget'));
      this.setState({
        budget: this.props.displayedJourney[0].budget, 
        isEditing: ''
      });
    }
  }

  render() {
    const { budget, isEditing } = this.state;
    const { journeyName, displayedJourney } = this.props;
    return (
      <div className='static-pannel-wrapper'>
        <p className='home-title'>
          Journey
          <span className='home-subtitle'>{journeyName}</span>
        </p>
        <div className='static-pannel'>
          <div className='static-pannel-section-wrapper'>
            <div className='static-pannel-section'>
              <div className='static-pannel-topic'>
                <p className='static-pannel-title'>目標</p>
                <p className='static-pannel-subtitle'>總預算</p>
              </div>
              <div className='static-pannel-update'>
              { isEditing === 'budget' 
                ? <div className='total-budget-update'>
                    <input 
                      id='total-budget-input'
                      className='static-pannel-input' 
                      type='text' 
                      placeholder={displayedJourney[0].budget}
                      onChange={this.onBudgetChange}
                      onKeyDown={this.handleEnter}
                    />
                    <button 
                      className='cancel-btn' 
                      onClick={()=>this.handleEditing('')}
                    >
                      <img className='cancel-btn-img' alt='cancel' src={CancelIcon}/>
                    </button>
                  </div>
                : <div className='static-pannel-text'>
                    <span>
                      {displayedJourney[0].budget}
                    </span>
                    <button 
                      className='update-btn'
                      onClick={()=> this.handleEditing('budget')}
                    >
                      <img className='update-icon-img' alt='update' src={UpdateIcon}/>
                    </button>
                  </div>
              }
              </div>
            </div>
          </div>
          <div className='static-pannel-section-wrapper'>
            <div className='static-pannel-section'>
              <div className='static-pannel-topic'>
                <p className='static-pannel-title'>支出</p>
                <p className='static-pannel-subtitle'>總支出</p>
              </div>
              <span className='static-pannel-amount'>
                {displayedJourney[0].expense}
              </span>
            </div>
          </div>
          <div className='static-pannel-section-wrapper'>
            <div className='static-pannel-section'>
              <div className='static-pannel-topic'>
                <p className='static-pannel-title'>剩餘</p>
                <p className='static-pannel-subtitle'>可支配預算</p>
              </div>
              <span className='static-pannel-amount'>
                {displayedJourney[0].budget - displayedJourney[0].expense}
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default StaticPannel;
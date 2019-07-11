import React, { Component } from 'react';
import SideBar from './SideBar/SideBar';
import SetBudget from './SetBudget/SetBudget';
import Accounts from './Accounts/Accounts';
import Charts from './Charts/Charts';
import Days from './Days/Days';
import './Home.css';
import SelectIcon from './select-white-icon.png';
import AddIcon from './add-white-icon.png';

const getData = (datas) => {
  console.log(datas);
  const getPercentage = (num) => {
    num.toFixed(3);
    let result = (num*100).toString();
    return result.slice(0,4);
  };

  const traffic_percentage = getPercentage(datas[0].traffic_expense / datas[0].expense),
    food_percentage = getPercentage(datas[0].food_expense / datas[0].expense),
    living_percentage = getPercentage(datas[0].living_expense / datas[0].expense),
    ticket_percentage = getPercentage(datas[0].ticket_expense / datas[0].expense),
    shopping_percentage = getPercentage(datas[0].shopping_expense / datas[0].expense);

  const data = [{ 
    name: '交通',
    cost: datas[0].traffic_expense,
    percentage: `${traffic_percentage}%`
  }, { 
    name: '食物',
    cost: datas[0].food_expense,
    percentage: `${food_percentage}%`
  }, { 
    name: '住宿',
    cost: datas[0].living_expense,
    percentage: `${living_percentage}%`
  }, {
    name: '票券',
    cost: datas[0].ticket_expense,
    percentage: `${ticket_percentage}%`
  }, {
    name: '購物',
    cost: datas[0].shopping_expense,
    percentage: `${shopping_percentage}%`
  }];
  console.log(data);
  return data;
 }

class Home extends Component {
  constructor(props){
    super(props);
    const {journeys, initialJourney} = this.props;
    this.state = {
      journeyId: journeys[journeys.length-1].id,
      displayedJourney: initialJourney,
      accounts: initialJourney[0].accountList,
      expenseList: initialJourney[0].accountList[0].expenseList,
      test: journeys[journeys.length-1].name,
      displayedAccountId: initialJourney[0].accountList[0].id,
      newDay: 2,
      data: getData(initialJourney)
    }
  };

  onJourneyChange = (id) => {
    const target = this.props.journeys.filter(item => item.id === id);
    this.setState({
      journeyId: id,
      displayedJourney: target,
      accounts: target[0].accountList,
      expenseList: target[0].accountList[0].expenseList,
      test: target[0].name,
      displayedAccountId: target[0].accountList[0].id,
      data: getData(target)
    });
  };

  onDayChange = (event) => {
    const id = +event.target.value;
    const day = this.state.accounts.filter(item => item.id === id);
    console.log(day[0].id);
    this.setState({ 
      expenseList: day[0].expenseList,
      displayedAccountId: day[0].id
    });
  };

  handleAddJourney = (newJourney)=> {
    this.props.addJourney(newJourney);
    this.setState({
      journeyId: newJourney[0].id,
      displayedJourney: newJourney,
      accounts: newJourney[0].accountList,
      expenseList: newJourney[0].accountList[0].expenseList,
      test: newJourney[0].name,
      data: getData(newJourney)
    })
  };

  handleBudgetsChange = (budgets, journeyId) => {
    this.props.updateBudgets(budgets, journeyId);
    this.setState({
      displayedJourney: budgets
    })
  };

  handleRemoveJourney = (updatedJourney, delJourneyId) => {
    this.props.removeJourney(updatedJourney, delJourneyId);
    const {journeys, initialJourney} = this.props;
    this.setState({
      journeyId: journeys[journeys.length-1].id,
      displayedJourney: initialJourney,
      accounts: initialJourney[0].accountList,
      expenseList: initialJourney[0].accountList[0].expenseList,
      test: journeys[journeys.length-1].name,
      displayedAccountId: initialJourney[0].accountList[0].id,
      data: getData(initialJourney)
    })
  };

  createNewDay = () => {
    const newDay = `Day${this.state.accounts.length + 1}`;
    console.log(newDay);
    fetch('http://localhost:3000/accounts', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        name: newDay,
        journey_id: this.state.journeyId
      })
    })
    .then(response => response.json())
    .then(updatedJourney => {
      this.props.addAccount(updatedJourney);
      const displayedAccount = updatedJourney[0].accountList.filter(item => item.name === newDay);
      this.setState({
        displayedJourney: updatedJourney,
        accounts: updatedJourney[0].accountList,
        expenseList: displayedAccount[0].expenseList,
        displayedAccountId: displayedAccount[0].id,
        data: getData(updatedJourney)
      });
    })
    .catch(err => alert('unable to add day'));
  };

  handleRemoveAccount = (delAccountId) => {
    fetch(`http://localhost:3000/accounts/${delAccountId}`, {
      method: 'DELETE',
    })
    .then(response => response.json())
    .then(updatedJourney=> {
      this.props.removeAccount(updatedJourney);
      this.setState({
        accounts: updatedJourney[0].accountList,
        expenseList: updatedJourney[0].accountList[0].expenseList,
        displayedAccountId: updatedJourney[0].accountList[0].id
      })
    })
    .catch(err => alert('unable to delete'));
  };

  handleAddExpense = (updatedJourney, displayedAccountId) => {
    this.props.addExpense(updatedJourney);
    const displayedAccount = updatedJourney[0].accountList.filter(item =>
      item.id === displayedAccountId);
    this.setState({
      displayedJourney: updatedJourney,
      accounts: updatedJourney[0].accountList,
      expenseList: displayedAccount[0].expenseList,
      data: getData(updatedJourney)
    });
  };

  handleUpdateExpense = (updatedJourney) => {
    this.props.updateExpense(updatedJourney);
    const { displayedAccountId } = this.state;
    const displayedAccount = updatedJourney[0].accountList.filter(item =>
      item.id === displayedAccountId);
    this.setState({
      displayedJourney: updatedJourney,
      accounts: updatedJourney[0].accountList,
      expenseList: displayedAccount[0].expenseList,
      data: getData(updatedJourney)
    })
  };

  handleRemoveExpense = (updatedJourney, displayedAccountId) => {
    this.props.removeExpense(updatedJourney);
    const displayedAccount = updatedJourney[0].accountList.filter(item =>
      item.id === displayedAccountId);
    this.setState({
      displayedJourney: updatedJourney,
      accounts: updatedJourney[0].accountList,
      expenseList: displayedAccount[0].expenseList,
      data: getData(updatedJourney)
    })
  };

  render( ) {
    return (
      <div className='home-container'>
        {/*<div className='side-bar'>
          <SideBar
            user={this.props.user}
            journeyList={this.props.journeyList}
            onJourneyChange={this.onJourneyChange}
            handleAddJourney={this.handleAddJourney}
            updateJourney={this.props.updateJourney}
            handleRemoveJourney={this.handleRemoveJourney}
          />
        </div>*/}
        <div className='main-section'>
          <div className='static-pannel-wrapper'>
            <p className='home-title'>行程 {this.state.test}</p>
            <div className='static-pannel'>
              <div className='static-pannel-section'>
                <div className='static-pannel-topic'>
                  <p className='static-pannel-title'>目標</p>
                  <p className='static-pannel-subtitle '>總預算</p>
                </div>
                <span className='static-pannel-amount editable-text'>{this.state.displayedJourney[0].budget}</span>
              </div>
              <div className='static-pannel-section'>
                <div className='static-pannel-topic'>
                  <p className='static-pannel-title'>支出</p>
                  <p className='static-pannel-subtitle'>總支出</p>
                </div>
                <span className='static-pannel-amount'>{this.state.displayedJourney[0].expense}</span>
              </div>
              <div className='static-pannel-section'>
                <div className='static-pannel-topic'>
                  <p className='static-pannel-title'>剩餘</p>
                  <p className='static-pannel-subtitle'>可支配預算</p>
                </div>
                <span className='static-pannel-amount'>{this.state.displayedJourney[0].budget - this.state.displayedJourney[0].expense}</span>
              </div>
            </div>
          </div>
          <div className='sub-section'>
            <SetBudget
            user={this.props.user}
            journeyId={this.state.journeyId}
            displayedJourney={this.state.displayedJourney}
            handleBudgetsChange={this.handleBudgetsChange}
            />
            <div className='minor-section'>
              <Charts
                displayedJourney={this.state.displayedJourney}
                data={this.state.data}
              />
              <div className='accounts-days-nav'>
              <div className='accounts-days-manage'>
                <button 
                  className='control-days-btn' 
                  onClick={this.createNewDay}
                >
                  <img className='add-day-img' alt='add' src={AddIcon}/>
                  <span>新增</span>
                </button>
                <button 
                  className='control-days-btn' 
                  onClick={() => this.handleRemoveAccount(this.state.displayedAccountId)}
                >
                  <span>刪除</span>
                </button>
                <div className='accounts-days'>
                  <select 
                    className='accounts-day-selector' 
                    name='accounts-day-selector'
                    onChange={this.onDayChange}
                  >
                    { this.state.accounts.map( day => 
                      <Days 
                        key={day.id} 
                        day={day}
                      />
                    )}
                  </select>
                  <span className='account-category-selector-icon'>
                    <img alt='select-green-icon'src={SelectIcon}/>
                  </span>
                </div>
              </div>
            </div>
              <Accounts
                accounts={this.state.accounts}
                expenseList={this.state.expenseList}
                displayedAccountId={this.state.displayedAccountId}
                handleAddExpense={this.handleAddExpense}
                handleUpdateExpense={this.handleUpdateExpense}
                handleRemoveExpense={this.handleRemoveExpense}
              />
            </div>
          </div>
          
        </div>
        // {/*
        //   <div className='accounts-section'>
        //     
        //     
        //   </div>*/}
          
        {/*<div className='footer'>
          <p className='web-info'>2019 Tripper. Created by Chin Yun Chen.</p>
        </div>*/}
      </div>
    );
  }
};

export default Home;
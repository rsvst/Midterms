/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  ScrollView,
  ToastAndroid,
  TouchableWithoutFeedback,
  DrawerLayoutAndroid,
  StatusBar,
  Button,
  FlatList,
  AppRegistry,
  ActivityIndicator,
  StyleSheet,
  Text,
  Switch,
  Modal,
  TextInput,
  Picker,
  DatePickerAndroid,
  TimePickerAndroid,
  View
} from 'react-native';
import items from './items';
const Item = Picker.Item;
//ito yung layout per item

export default class TodoList extends Component {
   constructor(props, ctx) {
    super(props, ctx);

    this.handlePress = this.handlePress.bind(this);
    this.itemDone = this.itemDone.bind(this);
    this.itemDelete = this.itemDelete.bind(this);
    this.itemEdit = this.itemEdit.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.toggleAddModal = this.toggleAddModal.bind(this);
    this.toggleEditModal = this.toggleEditModal.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.filterDefault = this.filterDefault.bind(this);
    this.ChooseDate = this.ChooseDate.bind(this);

    this.state = {
      inputTitle: '',
      inputDescription: '',
      inputAssigned: 0,
      loginmodal: true,
      inputUsername: '',
      inputPassword: '',
      addmodal: false,
      filtermode: "All",
      todoItems: [
        {
          key: 0,
          done: false,
          editmodal: false,
          title: 'Shopping',
          description: 'Milk',
          date: '5/5/2005',
          time: '11:11',
          creator: 'admin',
          assigned: 'admin'
        },
        {
          key: 1,
          done: true,      
          editmodal: false, 
          title: '13:00',
          description: 'Hair cut',
          date: '5/5/2005',
          time: '11:11',
          creator: 'admin',
          assigned: 'user1'
        }
      ],
      accounts: [
        {
          key: 0,
          username: 'admin',
          password: 'admin'          
        },
        {
           key: 1,
           username: 'user1',
           password: '12345'  
        },
        {
           key: 2,
           username: 'user2',
           password: '12345'  
        }
      ]
    };
  }
   
  handlePress() {
    if((this.state.inputTitle ==  '')||
      (this.state.inputDescription== '')){
        ToastAndroid.show('Please provide title and description.', ToastAndroid.SHORT);
    }
    else{
    const todoItems = this.state.todoItems.concat();
    const lastKey = 0;
    var today = new Date();
    date = today.getDate() + "/"+ parseInt(today.getMonth()+1) +"/"+ today.getFullYear();
    time = today.getHours()+":"+today.getMinutes();

    if(todoItems.length == 0){
        lastKey = 0;        
      }
      else{
        lastKey = todoItems[todoItems.length-1].key;                      
      }

    this.setState({
      todoItems: todoItems.concat([{
        key: lastKey + 1,
        done: false,
        editmodal: false,
        title: this.state.inputTitle,
        description: this.state.inputDescription,
        date: date,
        time: time,
        creator: this.state.inputUsername,
        assigned: this.state.accounts[this.state.inputAssigned].username
      }]),
      inputTitle: '',
      inputDescription: ''
    });
    this.toggleAddModal(!this.state.addmodal);
    this.setState({inputAssigned: this.state.accounts.findIndex(i => i.username == this.state.inputUsername)});
    }
  }

  itemDelete(key){
    var todoItems  = this.state.todoItems.concat();
    for(var i = 0; i< todoItems.length; i++){
      if(todoItems[i].key == key){
        todoItems.splice(i,1);
      }
    }
    this.setState({todoItems});
  }

  itemDone(key){
    var todoItems = this.state.todoItems.concat();
    for(var i = 0; i< todoItems.length; i++){
      if(todoItems[i].key == key){
        todoItems[i].done = !todoItems[i].done;
      }
    }
    this.setState({todoItems});
  }
  
  itemEdit(title, description, date, time, key){
    var todoItems = this.state.todoItems.concat();
    var position;
    for(var i = 0; i< todoItems.length; i++){
      if(todoItems[i].key == key){
        position = i ;
        todoItems[i].title = title;
        todoItems[i].description = description;
        todoItems[i].date = date;
        todoItems[i].time = time;
        
      }
    }
    this.setState({todoItems});
    this.toggleEditModal(!todoItems[position].editmodal, todoItems[position].key);
  }

  toggleModal(visible) {
      this.setState({ loginmodal: visible });
  }

  toggleAddModal(visible) {
      this.setState({ addmodal: visible });
  }
  toggleEditModal(visible, key){
    
    var todoItems = this.state.todoItems.concat();
    for(var i = 0; i< todoItems.length; i++){
      if(todoItems[i].key == key){
        todoItems[i].editmodal = visible;
        this.setState({inputTitle: todoItems[i].title});
        this.setState({inputDescription: todoItems[i].description});
      }
    }
    this.setState({todoItems});
    //ToastAndroid.show(key+'---', ToastAndroid.SHORT);  
  }

  login(){
    const accounts = this.state.accounts.concat();
    var found = false;
    if((this.state.inputUsername ==  '')||
      (this.state.inputPassword == '')){
        ToastAndroid.show('Please provide username and password.', ToastAndroid.SHORT);
    }
    else{
      for(var i = 0; i< accounts.length; i++){
        if((this.state.inputUsername == accounts[i].username )&&(this.state.inputPassword == accounts[i].password)){
            this.toggleModal(!this.state.loginmodal);
            found = true;
            break;
        }
        if((i == accounts.length-1)&&(found == false)){
            ToastAndroid.show('Please provide valid username and password.', ToastAndroid.SHORT);
        }
    }   
    }

    this.setState({inputAssigned: this.state.accounts.findIndex(i => i.username == this.state.inputUsername)});
  }

  logout(){
     this.setState({inputUsername: ''});
     this.setState({inputPassword: ''});
     this.setState({inputAssigned: 0});
    this.toggleModal(!this.state.loginmodal);
  }

  filterDefault(item){
    // if (item.assigned == this.state.inputUsername||item.creator == this.state.inputUsername){
    //   return true;
    // }
    if (this.state.filtermode == "All"){
      return item.assigned == this.state.inputUsername||item.creator == this.state.inputUsername;
    }
    else if(this.state.filtermode == "ToUser"){
      return item.assigned == this.state.inputUsername;      
    }
    else if(this.state.filtermode == "ByUser"){
      return item.creator == this.state.inputUsername;      
    }
    else if(this.state.filtermode == "Done"){
      return ((item.assigned == this.state.inputUsername||item.creator == this.state.inputUsername)&&item.done==true);      
    }
    else if(this.state.filtermode == "NotDone"){
      return ((item.assigned == this.state.inputUsername||item.creator == this.state.inputUsername)&&item.done==false);            
    }
  }

async ChooseDate(strDate){
 
  }

   render() {
    var navigationView = (
      <View style={styles.container}>
        <Text>Empty Drawer</Text>
      </View>
    );
   
  return (
      <DrawerLayoutAndroid
        drawerWidth={300}
        renderNavigationView={() => navigationView}>

        <Modal animationType = {"slide"}
               transparent = {false}
               visible = {this.state.loginmodal}>
                  <View style={styles.container}>
                      <View style={styles.items}>
                      <Text style={styles.welcome}>TODO LIST</Text>
                      <TextInput
                        style={ styles.textInput}
                        placeholder="UserName"
                        onChangeText={(text) => this.setState({ inputUsername: text })}
                        value={this.state.inputUsername}
                      />
                      <TextInput
                        style={styles.textInput}
                        secureTextEntry={true}
                        placeholder="Password"
                        onChangeText={(text) => this.setState({ inputPassword: text })}
                        value={this.state.inputPassword}
                      />
                      <Button style={styles.textInput} 
                        onPress={this.login}
                        title="Login"/>
                      </View>
                  </View>
            </Modal>
            
            <Modal animationType = {"slide"}
               transparent = {false}
               visible = {this.state.addmodal}>
                 <View style={styles.container}>
                    <View style={styles.items}>
                    <Text style={styles.welcome}>ADD NEW TODO</Text>
                    <TextInput
                      style={ styles.textInput}
                      onChangeText={(text) => this.setState({ inputTitle: text })}
                      value={this.state.inputTitle}
                    />
                    <TextInput
                      style={styles.textInput}
                      onChangeText={(text) => this.setState({ inputDescription: text })}
                      value={this.state.inputDescription}
                    />
                    <Picker
                      style={styles.textInput}
                      mode="dropdown"
                      selectedValue ={this.state.inputAssigned}
                      onValueChange ={(itemValue, itemIndex) => this.setState({inputAssigned: itemValue})}
                      >
                      {this.state.accounts.map((item,index) => {
                        return ( <Item label={item.username} value={item.key}/> ) })}
                    </Picker>
                    <Button style={styles.textInput} 
                      onPress={this.handlePress}
                      title="Add"/>
                    <Button style={styles.textInput} 
                      onPress={() => {this.toggleAddModal(!this.state.addmodal)}}
                      title="Cancel"/>
                      </View>
                  </View>
            </Modal>

        <ScrollView >
        <View style={styles.container}>
          <View style={styles.items}>
          <Text style={styles.welcome}>ToDo List</Text>
          <Picker
            style = {styles.textInput}
            mode = "dropdown"
            selectedValue ={this.state.filtermode}
            onValueChange ={(itemValue, itemIndex) => this.setState({filtermode: itemValue})}
            >
              <Item label="All" value = "All" />
              <Item label="Assigned to user" value = "ToUser" />
              <Item label="Assigned by user" value = "ByUser" />
              <Item label="Done" value = "Done" />
              <Item label="Not Done" value = "NotDone" />
            </Picker>
          <Button style={styles.textInput} 
            onPress={() => {this.toggleAddModal(!this.state.addmodal)}}
            title="Add"/>
          <Button style={styles.textInput} 
            onPress={this.logout}
            title="Logout"/>
        </View>
        </View>
      <View style={styles.container}>
          <FlatList
            data={this.state.todoItems.filter(this.filterDefault)}
            renderItem={({item}) => {

            var tempDate = item.date;
            var tempHr = item.time;

            const Done = () => {
              return this.itemDone(item.key);
            }
            const Delete = () =>{
              return this.itemDelete(item.key);
            }
            const Edit = () =>{
              return this.toggleEditModal(!item.editmodal, item.key);
            }
            const Save = () =>{
              return this.itemEdit(this.state.inputTitle, this.state.inputDescription, tempDate, tempHr, item.key);
            }
               return(
                 <View style={styles.items}>
                    <Modal animationType = {"slide"}
                        transparent = {false}
                        visible = {item.editmodal}>
                        <View style={styles.container}>
                        <View style={styles.items}>
                               <Text style={styles.welcome}>EDIT TODO</Text>
                                <TextInput
                                  style={ styles.textInput}
                                  onChangeText={(text) => this.setState({ inputTitle: text })}
                                  value={this.state.inputTitle}
                                />
                                <TextInput
                                  style={styles.textInput}
                                  onChangeText={(text) => this.setState({ inputDescription: text })}
                                  value={this.state.inputDescription}
                                />
                                <Button style={styles.textInput}
                                 onPress={async() =>{
                                     var defdate = item.date.split("/");
                                    try {
                                      const {action, year, month, day} = await DatePickerAndroid.open({
                                        date: new Date(parseInt(defdate[2]),parseInt(defdate[1]-1), parseInt(defdate[0]))
                                      });
                                      if (action !== DatePickerAndroid.dismissedAction) {
                                        tempDate = day+"/"+(parseInt(month)+1)+"/"+year;
                                      }
                                      } catch ({code, message}) {
                                          console.warn('Cannot open date picker', message);
                                      }}}
                                  title="Edit Date" />
                                <Button style={styles.textInput}
                                 onPress={async() => {try {
                                   var deftime = item.time.split(":");
                                    var pastDate = new Date(item.time);
                                    const {action, hour, minute} = await TimePickerAndroid.open({
                                      hour: parseInt(deftime[0]),
                                      minute: parseInt(deftime[1]),
                                      is24Hour: true,
                                    });
                                    if (action !== TimePickerAndroid.dismissedAction) {
                                      tempHr = hour+":"+minute;
                                    }
                                  } catch ({code, message}) {
                                    console.warn('Cannot open time picker', message);
                                  }}}
                                  title="Edit Time" />
                            
                            <Button style={styles.textInput} 
                            onPress={Save}
                            title="Save"/>

                            <Button style={styles.textInput} 
                            onPress={() => this.toggleEditModal(!item.editmodal, item.key)}
                            title="Cancel"/>

                      </View>
                      </View>
                    </Modal>
                    <View style={{flex: 1, flexDirection: 'row'}}>  
                      <Switch onValueChange={Done} value={item.done}/>
                      <View style={{ margin: 10}}>  
                        <Text style={item.done == true ? { fontSize: 20, textDecorationLine: 'line-through', width: 300 }:{ fontSize: 20, width: 300 }}>{item.title}</Text>
                        <Text style={item.done == true ? { fontSize: 20, textDecorationLine: 'line-through', width: 300 }:{ fontSize: 20, width: 300 }}>{item.description}</Text>
                        <Text style={item.done == true ? { fontSize: 20, textDecorationLine: 'line-through', width: 300 }:{ fontSize: 20, width: 300 }}>{item.date+" "+item.time}</Text>
                        <Text style={item.done == true ? { fontSize: 20, textDecorationLine: 'line-through', width: 300 }:{ fontSize: 20, width: 300 }}>{item.assigned}</Text>
                        <Text style={item.done == true ? { fontSize: 20, textDecorationLine: 'line-through', width: 300 }:{ fontSize: 20, width: 300 }}>{item.creator}</Text>
                      </View>
                    </View>
                    <View>
                      <Button style={{ fontSize: 10, width: 120}} onPress={Edit} title="Edit" />
                      <Button style={{ fontSize: 10, width: 120}} onPress={Delete} title="Delete" />
                    </View>
                </View>
              )
            }} />
        </View>
        </ScrollView>
      </DrawerLayoutAndroid>
    );
   }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 18,
    alignItems: 'center',
  },
  welcome: {
    fontSize: 25,
    fontWeight:'bold',
    textAlign: 'center'
  },
  textInput: {
    fontSize: 15,
    margin: 3,
    textAlign: 'left',
  },
  items: {
    backgroundColor: 'white',
    margin: 5,
    padding: 10,
    fontSize: 20,
    width: 300,
    borderRadius: 5,
    textAlign: 'center',
  },
});

AppRegistry.registerComponent('TodoList', () => TodoList);

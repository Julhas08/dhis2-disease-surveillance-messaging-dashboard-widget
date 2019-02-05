import React, { Component } from 'react';
//import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import UsersInfoModal from './UsersInfoModal';
// Diaglo box
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

// Loader
import Fade from '@material-ui/core/Fade';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
// Delete 
import DeleteForeverIcon from '@material-ui/icons/Delete';
import EditOutlined from '@material-ui/icons/EditOutlined';

// Tabs
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PhoneIcon from '@material-ui/icons/Phone';
import MessageOutlined from '@material-ui/icons/MessageOutlined';
import PersonPinIcon from '@material-ui/icons/PersonPin';
import HelpIcon from '@material-ui/icons/Help';
import MessageTwoTone from '@material-ui/icons/MessageTwoTone';
import TouchAppSharp from '@material-ui/icons/TouchAppSharp';
import AccountCircleOutlined from '@material-ui/icons/AccountCircleOutlined';
import Settings from '@material-ui/icons/Settings';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Badge from '@material-ui/core/Badge';
import MailIcon from '@material-ui/icons/Mail';
import Tooltip from '@material-ui/core/Tooltip';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';

// Radio
import green from '@material-ui/core/colors/green';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';

// Icons 
import Assignee from '@material-ui/icons/ViewListSharp';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
   button: {
    margin: theme.spacing.unit,
  },
  placeholder: {
    height: 40,
  },
  input: {
    display: 'none',
  },
  icon: {
    cursor: 'pointer',
  } 
});
const baseURL = "https://play.dhis2.org/2.31dev/";
const fetchOptions = {
			  headers: {
			    Accept: 'application/json',
			    'Content-Type': 'application/json',
          Authorization: "Basic " + btoa("admin:district")        		    
			  }
			};
function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};      
		
class GetUserInformation extends Component{
	constructor(){
		super();
		this.state = {
			totalValidations : 0,
      messageValidations : [],
      totalPrivate : 0,
      messagePrivates : [],
      totalTicket : 0,
      messageTickets : [],
      totalSystem : 0,
      messageSystem : [],
      open: false,
      openInboxModal: false,
      loading: false,
      value: 0,	
      validations: "Validations",	
      selectedValue: 'a',	
      users: [],
		}
	}
  componentDidMount() {
    this.setState({
      //labelWidth: ReactDOM.findDOMNode(this.InputLabelRef).offsetWidth,
    });
  }
  componentWillUnmount() {
    clearTimeout(this.timer);
  }
  handleClickModalOpen = () =>{

    this.setState({ openInboxModal: true });
  }
  handleClickAssigneeModal = () => {

    this.setState({ open: true });
    // user information

    function getUsers(){      
      return new Promise( (resolve, reject) => {
        console.log("API", baseURL+"api/users.json");
        fetch(baseURL+"api/users.json",fetchOptions) 
          .then(r => resolve(r.json()))
          .catch(err => reject(err));
        });              
           
    }
    getUsers().then(responseUserInfo => {
          let responseIndividualInfoString = responseUserInfo.users;
          this.setState({
            users: responseIndividualInfoString,
          });
          console.log("Users: ", this.state.users);
      });
  };
  handleChange = (event, value) => {
    this.setState({ value });
  };
  handleClose = () => {
    this.setState({ 
      open: false,
      openInboxModal: false,
     });
  };
	render(){
      const { loading, value } = this.state;
      const { classes } = styles;
      let i=1;
      let j=1;
      function getAllMessages(URL){  

          var promise1 = new Promise(function(resolve, reject) {
            fetch(baseURL+"api/30/messageConversations.json?filter=messageType:eq:VALIDATION_RESULT&fields=:all",fetchOptions) 
              .then(r => resolve(r.json()))
              .then( result => result.pager.total)
              .catch(err => reject(err));
          });
          var promise2 = new Promise(function(resolve, reject) {
            fetch(baseURL+"api/30/messageConversations.json?filter=messageType:eq:PRIVATE&fields=:all",fetchOptions) 
              .then(r => resolve(r.json()))
              .catch(err => reject(err));
          });
          var promise3 = new Promise(function(resolve, reject) {
            fetch(baseURL+"api/30/messageConversations.json?filter=messageType:eq:TICKET&fields=:all",fetchOptions) 
              .then(r => resolve(r.json()))
              .catch(err => reject(err));
          });
          var promise4 = new Promise(function(resolve, reject) {
            fetch(baseURL+"api/30/messageConversations.json?filter=messageType:eq:SYSTEM&fields=:all",fetchOptions) 
              .then(r => resolve(r.json()))
              .catch(err => reject(err));
          });
          return Promise.all([promise1, promise2, promise3, promise4]).then(function(values) {
            return values
          });                
               
        }
        getAllMessages().then(resp => {
          //console.log("resp[0].messageConversations: ",resp[0].messageConversations);
          this.setState({            
              totalValidations: resp[0].pager.total,
              messageValidations: resp[0].messageConversations,
              totalPrivate: resp[1].pager.total,
              messagePrivates: resp[1].messageConversations,
              totalTicket: resp[2].pager.total,
              messageTickets: resp[2].messageConversations,
              totalSystem: resp[3].pager.total,
              messageSystem: resp[3].messageConversations,
            });      	
        });
		return(

			<div> 
        
	      <Paper >
        
        <AppBar position="static" color="default">
          <Tabs
            value={value}
            onChange={this.handleChange}
            variant="scrollable"
            scrollButtons="on"
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab label={this.state.validations} icon={
              <Badge badgeContent={this.state.totalValidations} color="secondary">
                <MailIcon />
              </Badge>
            } />
            <Tab label="Inbox" icon={
              <Badge badgeContent={this.state.totalPrivate} color="primary">
                <MailIcon />
              </Badge>
            } />
            <Tab label="Ticket" icon={
              <Badge badgeContent={this.state.totalTicket} color="secondary">
                <MailIcon />
              </Badge>
            } />
            <Tab label="System" icon={ 
              <Badge badgeContent={this.state.totalSystem} color="primary">
                <MailIcon />
              </Badge>
            } />
            <Tab icon={
              <Fab color="primary" aria-label="Add">
                <AddIcon />
              </Fab>
            } />
          </Tabs>
        </AppBar>
        {value === 0 && <TabContainer>
           <FormControl>
          <InputLabel htmlFor="age-simple">Status</InputLabel>
          <Select
            value={this.state.age}
            onChange={this.handleChange}
            inputProps={{
              name: 'age',
              id: 'age-simple',
            }}
            style={{ 'min-width': '180px','margin-right':'20px' }}
          >
            <MenuItem value="">
              <em>No Status</em>
            </MenuItem>
            <MenuItem value="open">Open</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="invalid">Invalid</MenuItem>
            <MenuItem value="solved">Solved</MenuItem>
          </Select>
        </FormControl>
        <FormControl>
          <InputLabel htmlFor="age-simple">Priority</InputLabel>
          <Select
            value={this.state.age}
            onChange={this.handleChange}
            inputProps={{
              name: 'age',
              id: 'age-simple',
            }}
            style={{ 'min-width': '180px','margin-right':'20px' }}
          >
            <MenuItem value="">
              <em>No priority</em>
            </MenuItem>
            <MenuItem value="high">High</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="low">Low</MenuItem>
          </Select>
        </FormControl>
        <TextField
          id="standard-full-width"
          style={{'min-width':'400px' }}
          placeholder="Search"
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>S/N</TableCell>
                <TableCell>Sender</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>Read Status</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Follow-up</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Assignee</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.messageValidations.map(row => (
                <TableRow key={row.id}>
                  <TableCell>{i++}</TableCell>
                  <TableCell>{row.userFirstname } {row.userSurname}</TableCell>
                  <TableCell>{row.subject}</TableCell>
                  <TableCell>{row.read==false ? 'Not Seen' : "Seen"}</TableCell>
                  <TableCell>{row.priority}</TableCell>
                  <TableCell>{row.followUp==false ? '-' : "Yes"}</TableCell>
                  <TableCell>{row.created}</TableCell>
                  <TableCell>{row.assignee!=='undefined' ? '-' : row.assignee.id}</TableCell>
                  <TableCell> 
                    <Assignee style={{ 'cursor':'pointer'}} id={row.id} onClick={()=>this.handleClickAssigneeModal()} variant="contained" color="primary" className={styles.button}>
                      Detail
                    </Assignee>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </TabContainer>}
        {value === 1 && <TabContainer>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>S/N</TableCell>
                <TableCell>Sender</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>Read Status</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Follow-up</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>View Detail</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.messagePrivates.map(row => (
                <TableRow key={row.id}>
                  <TableCell>{i++}</TableCell>
                  <TableCell>{row.userFirstname } {row.userSurname}</TableCell>
                  <TableCell>{row.subject}</TableCell>
                  <TableCell>{row.read==false ? 'Not Seen' : "Seen"}</TableCell>
                  <TableCell>{row.priority}</TableCell>
                  <TableCell>{row.followUp==false ? 'No' : "Yes"}</TableCell>
                  <TableCell>{row.created}</TableCell>
                  
                  <TableCell> 
                    <Button id={row.id} onClick={()=>this.handleClickModalOpen(row.id)} variant="contained" color="primary" className={styles.button}>
                      Detail
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabContainer>}
        {value === 2 && <TabContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>S/N</TableCell>
                <TableCell>Sender</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>Read Status</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Follow-up</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>View Detail</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.messageTickets.map(row => (
                <TableRow key={row.id}>
                  <TableCell>{i++}</TableCell>
                  <TableCell>{row.userFirstname } {row.userSurname}</TableCell>
                  <TableCell>{row.subject}</TableCell>
                  <TableCell>{row.read==false ? 'Not Seen' : "Seen"}</TableCell>
                  <TableCell>{row.priority}</TableCell>
                  <TableCell>{row.followUp==false ? 'No' : "Yes"}</TableCell>
                  <TableCell>{row.created}</TableCell>
                  <TableCell> 
                    <Button id={row.id} onClick={()=>this.handleClickModalOpen(row.id)} variant="contained" color="primary" className={styles.button}>
                      Detail
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabContainer>}
        {value === 3 && <TabContainer>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>S/N</TableCell>
                <TableCell>Sender</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>Read Status</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Follow-up</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>View Detail</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.messageSystem.map(row => (
                <TableRow key={row.id}>
                  <TableCell>{i++}</TableCell>
                  <TableCell>{row.userFirstname } {row.userSurname}</TableCell>
                  <TableCell>{row.subject}</TableCell>
                  <TableCell>{row.read==false ? 'Not Seen' : "Seen"}</TableCell>
                  <TableCell>{row.priority}</TableCell>
                  <TableCell>{row.followUp==false ? 'No' : "Yes"}</TableCell>
                  <TableCell>{row.created}</TableCell>
                  <TableCell> 
                    <Button id={row.id} onClick={()=>this.handleClickModalOpen(row.id)} variant="contained" color="primary" className={styles.button}>
                      Detail
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabContainer>}
        {value === 4 && <TabContainer>
          <h3> Create new message </h3>
          <TextField
            id="standard-full-width"            
            placeholder="To"
            margin="normal"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}          
          />
           <RadioGroup
            aria-label="Gender"
            name="gender1"
            value={this.state.value}
            onChange={this.handleChange}
          >
            <FormControlLabel value="female" control={<Radio />} label="Private Message" />
            <FormControlLabel value="male" control={<Radio />} label="Feedback Message" />
            
          </RadioGroup>
          <TextField
            id="standard-full-width"
            fullWidth
            placeholder="From"
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}          
          />
          <TextField
            id="standard-multiline-flexible"
            fullWidth
            multiline
            rows="4"
            margin="normal"
            placeholder="Message"
          />
          <Button variant="contained" color="primary">
            SEND
          </Button>
          


        </TabContainer>
        }
          
        </Paper>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth = {'md'}
        >
          <DialogTitle id="alert-dialog-title">Assignee </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">           
             <FormControl>
              <InputLabel htmlFor="age-simple">Select Assignee</InputLabel>
              <Select
                value={this.state.age}
                onChange={this.handleChange}
                inputProps={{
                  name: 'age',
                  id: 'age-simple',
                }}
                style={{ 'cursor':'pointer','min-width': '480px','margin-right':'20px' }}
              >
                <MenuItem value="">
                  <em>Select user</em>
                </MenuItem>
                {this.state.users.map(info => (
                  <MenuItem value={info.id}>{info.displayName}</MenuItem>
                ))}
              </Select>
            </FormControl>

            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary" autoFocus>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>	
        <Dialog
          open={this.state.openInboxModal}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth = {'md'}
        >
          <DialogTitle id="alert-dialog-title"></DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">           
             <h3> Will add soon............</h3>              

            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary" autoFocus>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
			</div> 
		);
	}

}


GetUserInformation.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(GetUserInformation);
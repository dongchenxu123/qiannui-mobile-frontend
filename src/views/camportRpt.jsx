import {Link, ListView, Modal} from 'nuke'
import {createElement, Component} from 'weex-rx';
import { View, Text, TouchableHighlight  } from 'nuke-components';
import { getAuthSign,getCompaignReport } from '../api';

class CamparginRpt extends Component{
    constructor() {
        super();   
        this.state = {
            subway_token:'',
            campaign:[],
            rpt:[]
        }   
    }

    componentWillMount(){
          getAuthSign().then((result) => {
             this.setState({subway_token:result});             

          });
    }

}
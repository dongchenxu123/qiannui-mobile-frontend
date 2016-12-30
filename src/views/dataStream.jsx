'use strict';
import {mount} from 'nuke-mounter';
import {createElement, Component} from 'weex-rx';
import {View, Text, Link, Grid, Col, Image} from 'nuke';
import { browser, appCont, home, my, shareLightActive } from '../static/static';

class DataStream extends Component {
	render () {
		return (
			<View>
			     <View style={styles.header}>
	    		    北京你好
    		    </View>
    		    <View style={styles.main}>
    		        <Text>DataStream</Text>
    		    </View>
    		    <View style={styles.footer}>
    		       <Grid style={styles.gridWrap}>
                          <Col style={styles.col1}>
                          	<Link href="qap://index.js">
		                         <View>
		                              <Image source={{uri: browser}}  style={styles.imgStyle}/>
		                         	  <Text style={styles.textColor}>健康诊断</Text>
		                         </View>
                    		</Link>
                          </Col>
                          <Col style={styles.col2}>
                          	<Link href="qap://user.js">
		                         <View>
		                              <Image source={{uri: home}}  style={styles.imgStyle}/>
		                         	  <Text style={styles.textColor}>用户</Text>
		                         </View>
                    		</Link>
                          </Col>
                          <Col style={styles.col3}>
                          	<Link href="qap://dataStream.js">
		                         <View>
		                              <Image source={{uri: shareLightActive}}  style={styles.imgStyle}/>
		                         	  <Text style={[styles.textColor,{color:'#40aae1'}]}>淘外引流</Text>
		                         </View>
                    		</Link>
                          </Col>
                          <Col style={styles.col4}>
	                          <Link href="qap://plan.js">
		                         <View>
		                              <Image source={{uri: appCont}}  style={styles.imgStyle}/>
		                         	  <Text style={styles.textColor}>计划</Text>
		                         </View>
                    		</Link>
                          </Col>
                          <Col style={styles.col5}>
	                          <Link href="qap://aboutUs.js">
			                         <View>
			                              <Image source={{uri: my}}  style={styles.imgStyle}/>
			                         	  <Text style={styles.textColor}>联系我们</Text>
			                         </View>
	                    		</Link>
                          </Col>
                    </Grid>
    		     </View>
			</View>
		)
	}
}
const styles={
	  header: {
	  	 height: '120rem',
	  	 width: '100%'
	  },
	  main: {
	  	flexFlow: 'column',
	  	flex: 1,
	  	width: '100%',
	  	background: '#ccc'
	  },
	  footer: {
	  	height: '120rem',
	  	width: '100%'
	  },
	  textColor: {
	  	color: '#333',
	  	display: 'block',
	  	textAlign: 'center'
	  },
	  imgStyle: {
	  	width:'48rem',
	  	height:'48rem',
	  	borderRadius:'60rem',
	  	display: 'block', 
	  	margin: '0 auto',
	  	padding:'15rem 0'
	  },
	  gridWrap:{
	        height:'280rem'
	    	},
	  col1:{
	        justifyContent:'center',
	        alignItems:'center'
	    },
	  col2:{
	        justifyContent:'center',
	        alignItems:'center'
	    },
	  col3:{
	        justifyContent:'center',
	        alignItems:'center'
	   },
	  col4:{
	        justifyContent:'center',
	        alignItems:'center'
	   },
	  col5:{
	        justifyContent:'center',
	        alignItems:'center'
	  }
}

mount(<DataStream />, 'body');


export default DataStream
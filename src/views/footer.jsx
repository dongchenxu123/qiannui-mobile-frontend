'use strict';
import {mount} from 'nuke-mounter';
import {createElement, Component} from 'weex-rx';
import {View, Text, Grid, Col, Link, Image} from 'nuke';
import { browser, appCont, home, my, shareLight } from '../static/static';
class FooterView extends Component {
	render () {
		return (
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
                          	<Link href="qap://views/user.js">
		                         <View>
		                              <Image source={{uri: home}}  style={styles.imgStyle}/>
		                         	  <Text style={styles.textColor}>用户</Text>
		                         </View>
                    		</Link>
                          </Col>
                          <Col style={styles.col3}>
                          	<Link href="qap://views/dataStream.js">
		                         <View>
		                              <Image source={{uri: shareLight}}  style={styles.imgStyle}/>
		                         	  <Text style={styles.textColor}>淘外引流</Text>
		                         </View>
                    		</Link>
                          </Col>
                          <Col style={styles.col4}>
	                          <Link href="qap://views/plan.js">
		                         <View>
		                              <Image source={{uri: appCont}}  style={styles.imgStyle}/>
		                         	  <Text style={styles.textColor}>计划</Text>
		                         </View>
                    		</Link>
                          </Col>
                          <Col style={styles.col5}>
	                          <Link href="qap://views/aboutUs.js">
			                         <View>
			                              <Image source={{uri: my}}  style={styles.imgStyle}/>
			                         	  <Text style={styles.textColor}>联系我们</Text>
			                         </View>
	                    		</Link>
                          </Col>
                    </Grid>
    		        
    		    </View>
		)
	}
}
const styles={
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

export default FooterView

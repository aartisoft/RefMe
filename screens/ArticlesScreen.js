import React from 'react';
import { ScrollView, StyleSheet, StatusBar, View, Button, Dimensions } from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import axios from 'axios';
import { Container, Header, Content, Card, CardItem, Body, Text } from 'native-base';
import moment from 'moment';

import { connect } from 'react-redux';
import * as referenceAction from '../actions/referenceAction';

import Pdf from 'react-native-pdf';

class ArticlesScreen extends React.Component {

  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('article_title', 'Loading...'),
    };
  };

  constructor(props) {
  	super(props)

    this.DEBUGGING = true

    this.props.navigation.setParams({ title: "Loading..."})

    this.state = {
      hasLoaded: false,
      article: null,
      id: this.props.navigation.getParam('material_id', {})
    }

  	this.toggleReference = this.toggleReference.bind(this)
    this.getArticle = this.getArticle.bind(this)

    // Fetch my material
    this.getArticle()
  }

  getArticle() {
    const { id } = this.state

    const PLATFORM_URL = "http://platform.x5gon.org/api/v1"
    const ENDPOINT = "/oer_materials/" + id
    const url = PLATFORM_URL + ENDPOINT
    
    axios.get(url, {} )
      .then(res => {
        const article = res.data.oer_materials

        if(typeof article !== "undefined") {
          this.setState({
            hasLoaded: true,
            article: article
          })

          this.props.navigation.setParams({ article_title: article.title })
        }
      })
      .catch(error => {
        console.log(error);
      })
  }

  toggleReference() {

    const { id } = this.state

    let ref = {
      material_id: id,
    }

    this.props.addReference(ref);
  }
  
  render() {
  	
    const { hasLoaded, article } = this.state

    if(hasLoaded) {
      const source = { uri:article.url, cache:true };
      if(this.DEBUGGING) { console.log(source) }

      return (
         <Pdf
              source={source}
              onLoadComplete={(numberOfPages,filePath)=>{
                  console.log(`number of pages: ${numberOfPages}`);
              }}
              onPageChanged={(page,numberOfPages)=>{
                  console.log(`current page: ${page}`);
              }}
              onError={(error)=>{
                  console.log(error);
              }}
              onPressLink={(uri)=>{
                  console.log(`Link presse: ${uri}`)
              }}
              style={styles.pdf}/>
      )
    } else {
      return (
        <View style={styles.centerContainer}>
          <Text styles={styles.baseText}>Loading...</Text>   
        </View>
      )
    }
	}
}

const styles = StyleSheet.create({
  header: {
    borderRadius: 20,
  },
  footer: {
    borderRadius: 20,
  },
  card: {
    margin: 20,
    borderRadius: 20,
  },
  baseText: {
    color: '#000'
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    textDecorationLine: 'underline' 
  },
  container: {
    flexGrow: 1,
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomCard: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  baseText: {
    color: '#000'
  },
  pdf: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

const mapStateToProps = (state) => ({
    references: state.references,
})

const mapDispatchToProps = (dispatch) => ({
  addReference: ref => dispatch(referenceAction.addReference(ref)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ArticlesScreen)

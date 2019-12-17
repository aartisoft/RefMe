import React from 'react';
import { ScrollView, StyleSheet, StatusBar, View, Dimensions } from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import axios from 'axios';
import { Container, Header, Content, Card, CardItem, 
    Body, Text, Icon, Button} from 'native-base';
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
      id: this.props.navigation.getParam('material_id', {}),
      currentpage: 1,
      lastpage: 1,
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
            article: article,
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

  shouldComponentUpdate(nextProps, nextState) { 
    return true
  }
  
  render() {
  	
    const { hasLoaded, article, currentpage, lastpage } = this.state

    if(hasLoaded) {

      const source = { uri:article.url, cache:true };
      if(this.DEBUGGING) { console.log(source) }

      return (
        <>
          <Pdf
            ref={(pdf) => { this.pdf = pdf; }}
            source={source}
            onLoadComplete={(numberOfPages,filePath)=>{
                if(this.DEBUGGING) { console.log(`number of pages: ${numberOfPages}`) }
                this.setState({ lastpage : numberOfPages })
            }}
            onPageChanged={(page,numberOfPages)=>{
                if(this.DEBUGGING) { console.log(`current page: ${page}`) }
                this.setState({ currentpage : page})
            }}
            onError={(error)=>{
                if(this.DEBUGGING) { console.log(error) }
            }}
            onPressLink={(uri)=>{
                if(this.DEBUGGING) { console.log(`Link presse: ${uri}`) }
            }}
            style={styles.pdf}/>
          <View style={styles.floatingButtonsContainer}>
            <Button light style={styles.floatingButton}
              onPress={() => {
                if(this.DEBUGGING) { console.log(currentpage + " : " + lastpage) }

                if(currentpage>1) { 
                  this.pdf.setPage(currentpage - 1) 
                  this.setState({ currentpage : currentpage - 1})
                }
              }}>
              <Icon name='arrow-up' />
            </Button>
            <Button light style={styles.floatingButton}
              onPress={() => {
                if(this.DEBUGGING) { console.log(currentpage + " : " + lastpage) }

                if(currentpage<lastpage) { 
                  this.pdf.setPage(currentpage + 1) 
                  this.setState({ currentpage : currentpage + 1})
                }
              }}>
              <Icon name='arrow-down' />
            </Button>
          </View>
        </>
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
  floatingButtonsContainer: {
    position: 'absolute',
    right: 20,
    bottom: 20,
  },
  floatingButton: {
  }
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

import React from 'react';
import { ScrollView, StyleSheet, StatusBar, View, Button } from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import axios from 'axios';
import { Container, Header, Content, Card, CardItem, Body, Text } from 'native-base';
import moment from 'moment';

import { connect } from 'react-redux';
import * as referenceAction from '../actions/referenceAction';

class ArticlesScreen extends React.Component {

  constructor(props) {
  	super(props)

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

    const PLATFORM_URL = "https://platform.x5gon.org/api/v1"
    const ENDPOINT = "/oer_materials/" + id
    const url = PLATFORM_URL + ENDPOINT
    
    axios.get(url, {} )
      .then(res => {
        const article = res.data.oer_materials;
        
        console.log(article)

        this.setState({
          hasLoaded: true,
          article: article
        })
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
      var contributorsAsArray = [] 

      article.wikipedia.map((author) => {
        contributorsAsArray.push(author.name)
      })

      const contributors = contributorsAsArray.join(", ")

      return (
         <ScrollView contentContainerStyle={styles.container}>
           <Card style={styles.card}>
              <CardItem style={styles.header}>
                <Body>
                  <Text>{article.title}</Text>
                  <Text note>{contributors}</Text>
                </Body>
              </CardItem>
              <CardItem>
                  <Text numberOfLines={30} style={{ width: `100%` }}>{article.description}</Text>    
              </CardItem>
              <CardItem style={styles.footer}>
                 <Button
                  title={`Add to references`}
                  onPress={this.toggleReference}
                />
              </CardItem>
           </Card>
        </ScrollView>
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

ArticlesScreen.navigationOptions = {
  title: 'Articles',
};

const styles = StyleSheet.create({
  header: {
    borderRadius: 20,
  },
  footer: {
    borderRadius: 20,
  },
  card: {
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
    padding: 20,
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  baseText: {
    color: '#000'
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

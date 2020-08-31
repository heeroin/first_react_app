// Components/Search.js

import films from '../Helpers/filmsData'
import React from 'react'
import FilmItem from './FilmItem'
import { getFilmsFromApiWithSearchedText } from '../API/TMDBApi'
import { StyleSheet, View, TextInput, Button, FlatList, Text, ActivityIndicator } from 'react-native'


class Search extends React.Component {

    constructor(props) {
        super(props)
        this.page = 0,
        this.totalPages = 0,
        this.searchedText = "" // Initialisation de notre donnée searchedText en dehors du state
        this.state = {
            films: [],
            isLoading: false           
        }
    }

    _loadFilms() {
        if (this.searchedText.length > 0) { // Seulement si le texte recherché n'est pas vide
            this.setState({isLoading : true})
            getFilmsFromApiWithSearchedText(this.searchedText, this.page+1).then(data => {
                this.page = data.page
                this.totalPages = data.total_pages
                this.setState({                    
                    films: [...this.state.films, ...data.results],
                    isLoading: false })
            })
        }
    }

    _displayLoading() {
        if (this.state.isLoading) {
          return (
            <View style={styles.loading_container}>
              <ActivityIndicator size='large' />
              {/*Par défaut size vaut small, on met donc large pour que le chargement soit bien visible */}
            </View>
          )
        }
      }

    _searchTextInputChanged(text) {
        this.searchedText = text // Modification du texte recherché à chaque saisie de texte, sans passer par le setState comme avant
    }

    _searchFilms(text) {
        this.page = 0
        this.setState({ films: [] })   
        this._loadFilms()
        
    }


    render() {
        console.log(this.state.isLoading)        
        return (
            <View style={styles.main_container}>
                <TextInput style={styles.textinput} 
                placeholder='Titre du film' 
                onChangeText={(text) => this._searchTextInputChanged(text)}
                onSubmitEditing ={() => this._loadFilms()}
                />
                <Button title='Rechercher' onPress={() => this.searchFilms()} />
                <FlatList
                    data={this.state.films}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => <FilmItem film={item} />}
                    onEndReachedThreshold={0.5}
                    onEndReached = {() => {if(this.page < this.totalPages){
                        this._loadFilms()
                    }
                }}                                
                />
                {this._displayLoading()}
            </View>                
        )
    }
}

const styles = StyleSheet.create({
    main_container: {
        flex: 1,       
    },

    textinput: {
        marginLeft: 5,
        marginRight: 5,
        height: 50,
        borderColor: '#000000',
        borderWidth: 1,
        paddingLeft: 5
    },

    loading_container: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 100,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
      }
})

export default Search
import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TextInput,
  Dimensions,
  Platform,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import SplashScreen from 'react-native-splash-screen';
import uuid from 'uuid-random';
import {values} from 'lodash-es';
import Loader from '../components/Loader';
import Todo from '../components/Todo';

interface Itodo {
  id: any;
  isCompleted: boolean;
  text: string;
  createAt: number;
}

interface Itodos {
  [key: string]: Itodo;
}

const {width, height} = Dimensions.get('window');

const Home = () => {
  const [newToDo, setNewToDo] = useState('');
  const [loadedToDos, setLoadedToDos] = useState(false);
  const [toDos, setToDos] = useState<Itodos | null>(null);

  const _crontollNewToDo = (text: string) => setNewToDo(text);
  const _loadToDos = async () => {
    try {
      SplashScreen.hide();
      const toDos = await AsyncStorage.getItem('toDos');
      const parsedToDos = toDos ? JSON.parse(toDos) : null;
      setLoadedToDos(true);
      setToDos(parsedToDos || {});
    } catch (error) {
      console.log(error);
    } finally {
      SplashScreen.hide();
    }
  };
  const _addToDo = () => {
    if (newToDo !== '') {
      const ID = uuid();
      const newToDoObject = {
        [ID]: {
          id: ID,
          isCompleted: false,
          text: newToDo,
          createAt: Date.now(),
        },
      };
      setNewToDo('');
      setToDos(prevState => {
        const newState = newToDoObject
          ? {
              ...newToDoObject,
              ...prevState,
            }
          : null;
        if (newState) _saveToDos(newState);
        return {...newState};
      });
    }
  };
  const _deleteToDo = (id: string) => {
    setToDos(prevState => {
      const toDos = prevState;
      if (toDos) {
        delete toDos[id];
        _saveToDos(toDos);
      }
      return {...prevState, ...toDos};
    });
  };
  const _uncompleteToDo = (id: string) => {
    setToDos(prevState => {
      const newState = prevState
        ? {
            ...prevState,
            [id]: {
              ...prevState[id],
              isCompleted: false,
            },
          }
        : null;
      if (newState) _saveToDos(newState);
      return {...newState};
    });
  };
  const _completeToDo = (id: string) => {
    setToDos(prevState => {
      const newState = prevState
        ? {
            ...prevState,
            [id]: {...prevState[id], isCompleted: true},
          }
        : null;
      if (newState) _saveToDos(newState);
      return {...newState};
    });
  };
  const _updateToDo = (id: string, text: string) => {
    setToDos(prevState => {
      const newState = prevState
        ? {
            ...prevState,
            [id]: {
              ...prevState[id],
              text,
            },
          }
        : null;
      if (newState) _saveToDos(newState);
      return {...newState};
    });
  };
  const _saveToDos = async (newToDos: Itodos) =>
    await AsyncStorage.setItem('toDos', JSON.stringify(newToDos));

  useEffect(() => {
    _loadToDos();
  }, []);

  return loadedToDos ? (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Text style={styles.title}>Kawai To Do</Text>
      <View style={styles.card}>
        <TextInput
          style={styles.input}
          placeholder={'New To Do'}
          value={newToDo}
          onChangeText={_crontollNewToDo}
          placeholderTextColor={'#999'}
          returnKeyType={'done'}
          autoCorrect={false}
          onSubmitEditing={_addToDo}
          underlineColorAndroid={'transparent'}
        />
        <ScrollView contentContainerStyle={styles.toDos}>
          {values(toDos)
            .reverse()
            .map(toDo => (
              <Todo
                key={toDo.id}
                deleteToDo={_deleteToDo}
                uncompleteToDo={_uncompleteToDo}
                completeToDo={_completeToDo}
                updateToDo={_updateToDo}
                {...toDo}
              />
            ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  ) : (
    <Loader />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F23657',
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontSize: 30,
    marginTop: 50,
    fontWeight: '200',
    marginBottom: 30,
  },
  card: {
    backgroundColor: 'white',
    // flex: 1,
    width: width - 25,
    height: height - 200,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    ...Platform.select({
      ios: {
        shadowColor: 'rgb(50,50,50)',
        shadowOpacity: 0.5,
        shadowRadius: 5,
        shadowOffset: {
          height: -1,
          width: 0,
        },
      },
      android: {
        elevation: 3,
      },
    }),
  },
  input: {
    padding: 20,
    borderBottomColor: '#bbb',
    borderBottomWidth: 1,
    fontSize: 25,
  },
  toDos: {
    alignItems: 'center',
  },
});

export default Home;

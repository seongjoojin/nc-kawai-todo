import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TextInput,
  GestureResponderEvent,
  TextInputFocusEventData,
} from 'react-native';

interface IProps {
  text: string;
  isCompleted: boolean;
  deleteToDo: (id: string) => void;
  id: string;
  uncompleteToDo: (id: string) => void;
  completeToDo: (id: string) => void;
  updateToDo: (id: string, toDoValue: string) => void;
}

const {width} = Dimensions.get('window');

const Todo = ({
  id,
  text,
  isCompleted,
  uncompleteToDo,
  completeToDo,
  deleteToDo,
  updateToDo,
}: IProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [toDoValue, setToDoValue] = useState(text);
  const _toggleComplete = (event: GestureResponderEvent) => {
    event.stopPropagation();
    isCompleted ? uncompleteToDo(id) : completeToDo(id);
  };
  const _startEditing = (event: GestureResponderEvent) => {
    event.stopPropagation();
    setIsEditing(true);
  };
  const _finishEditing = (event: any) => {
    event.stopPropagation();
    updateToDo(id, toDoValue);
    setIsEditing(false);
  };
  const _controllInput = (text: string) => setToDoValue(text);

  return (
    <View style={styles.container}>
      <View style={styles.column}>
        <TouchableOpacity onPressOut={_toggleComplete}>
          <View
            style={[
              styles.circle,
              isCompleted ? styles.completedCircle : styles.uncompletedCircle,
            ]}
          />
        </TouchableOpacity>
        {isEditing ? (
          <TextInput
            style={[
              styles.text,
              styles.input,
              isCompleted ? styles.completedText : styles.uncompletedText,
            ]}
            value={toDoValue}
            multiline={true}
            onChangeText={_controllInput}
            returnKeyType={'done'}
            onBlur={_finishEditing}
            underlineColorAndroid={'transparent'}
          />
        ) : (
          <Text
            style={[
              styles.text,
              isCompleted ? styles.completedText : styles.uncompletedText,
            ]}>
            {text}
          </Text>
        )}
      </View>
      {isEditing ? (
        <View style={styles.actions}>
          <TouchableOpacity onPress={_finishEditing}>
            <View style={styles.actionContainer}>
              <Text style={styles.actionText}>✅</Text>
            </View>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.actions}>
          <TouchableOpacity onPressOut={_startEditing}>
            <View style={styles.actionContainer}>
              <Text style={styles.actionText}>✏️</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPressOut={event => {
              event.stopPropagation();
              deleteToDo(id);
            }}>
            <View style={styles.actionContainer}>
              <Text style={styles.actionText}>❌</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width - 50,
    borderBottomColor: '#bbb',
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 3,
    marginRight: 20,
  },
  completedCircle: {
    borderColor: '#bbb',
  },
  uncompletedCircle: {
    borderColor: '#F23657',
  },
  text: {
    fontWeight: '600',
    fontSize: 20,
    marginVertical: 20,
  },
  completedText: {
    color: '#bbb',
    textDecorationLine: 'line-through',
  },
  uncompletedText: {
    color: '#353839',
  },
  column: {
    flexDirection: 'row',
    alignItems: 'center',
    width: width / 2,
  },
  actions: {
    flexDirection: 'row',
  },
  actionContainer: {
    marginVertical: 10,
    marginHorizontal: 10,
  },
  input: {
    width: width / 2,
    marginVertical: 15,
    paddingBottom: 5,
  },
  actionText: {
    fontSize: 15,
  },
});

export default Todo;

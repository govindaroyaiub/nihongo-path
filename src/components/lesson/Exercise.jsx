import ChoiceExercise from './ChoiceExercise'
import TypeExercise from './TypeExercise'
import OrderExercise from './OrderExercise'

const BY_TYPE = { choice: ChoiceExercise, type: TypeExercise, order: OrderExercise }

export default function Exercise(props) {
  const Component = BY_TYPE[props.exercise.type]
  return <Component {...props} />
}

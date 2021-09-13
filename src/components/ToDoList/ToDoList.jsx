import React from 'react';
import {
	Button,
	Checkbox,
	FormControlLabel,
	makeStyles,
	TextField
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
	button: {
		marginLeft: theme.spacing(1),
	},
	checkBox: {
		display: 'flex',
		justifyContent: 'start',
		alignItems: 'center',
		paddingLeft: theme.spacing(2),
	},
}));

const ToDoList = ({
										tasks,
										createTask,
										toggleCompleted,
										handleInputChange,
										inputValue
}) => {

	const styles = useStyles();

	return (
		<div>
				<TextField
					id="newTask"
					type="text"
					onChange={(e) => handleInputChange(e)}
					size="medium"
					placeholder="Add task..."
				/>
			<Button
				variant="contained"
				color="primary"
				className={styles.button}
				onClick={() => createTask(inputValue)}
			>
				Create task
			</Button>
				{tasks.map((task, key) => {
					return(
						<div key={key} className={styles.checkBox}>
							<FormControlLabel
								control={
									<Checkbox
										checked={task.completed}
										onClick={() => toggleCompleted(task.id)}
										name="checkedB"
										color="primary"
									/>
								}
								label={task.content}
							/>
						</div>
					)
				})}
		</div>
	);
};

export default React.memo(ToDoList);
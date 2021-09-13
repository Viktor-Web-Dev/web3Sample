import React, { useEffect, useState, memo } from 'react';
import Web3 from 'web3';
import {
	CircularProgress,
	Container,
	makeStyles,
	Typography
} from '@material-ui/core';

import {TODO_LIST_ADDRESS, TODO_LIST_ABI} from '../config';
import ToDoList from '../ToDoList/ToDoList';

const useStyles = makeStyles(() => ({
	root: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
	wrapper: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		height: '100vh',
	},
	container: {
		width: '390px',
	},
}));

const MainComponent = () => {
	const classes = useStyles();
	const [item, setItem] = useState(
		{
			tasks: [],
			taskCount: 0,
			account: '',
			loading: true,
		});
	const [flag, setFlag] = useState(false);
	const [inputValue, setInputValue] = useState('');

	const loadBlockchainData = async () => {
		try {
			const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
			const accounts = await web3.eth.getAccounts();
			const todoList = new web3.eth.Contract(TODO_LIST_ABI, TODO_LIST_ADDRESS);
			const taskCount = await todoList.methods.taskCount().call();
			let arr = []
			let i = 0
			do {
				const task = await todoList.methods.tasks(i).call();
				arr = [...arr, task]
				i++
			} while (i <= taskCount)

			setItem((prev) => (
				{
					...prev,
					tasks: arr,
					loading: false,
					account: accounts[0],
					taskCount,
					todoList,
				}
			));
		} catch (e) {
			throw(e) 
		}
	};

	const createTask = (content) => {
		setItem((prev) => ({...prev, loading: true}));
		item.todoList.methods.createTask(content).send({ from: item.account })
			.once('receipt', () => {
				setItem((prev) => ({...prev, loading: false}));
				setFlag(true);
			});
	};

	const toggleCompleted = (taskId) => {
		setItem((prev) => ({...prev, loading: true}));
		item.todoList.methods.toggleCompleted(taskId).send({ from: item.account })
			.once('receipt', () => {
				setItem((prev) => ({...prev, loading: false}));
				setFlag(true);
			});
	};

	const handleInputChange = (event) => {
		const {value} = event.currentTarget;
		setInputValue(value);
	};

	useEffect(() => {
		 loadBlockchainData().catch((e) => console.log('==========>e', e));
	}, []);

	useEffect(() => {
		if(flag) {
			loadBlockchainData().catch((e) => console.log('==========>e', e));
			setFlag(false);
		}
	}, [flag]);

	return (
		<Container className={classes.wrapper}>
			<Container className={classes.container}>
				<Typography variant="h2">
					TO DO LIST
				</Typography>
				{item.loading ? (
					<div className={classes.root}>
						<CircularProgress />
					</div>
				) : (
					<ToDoList
						tasks={item.tasks}
						createTask={createTask}
						toggleCompleted={toggleCompleted}
						inputValue={inputValue}
						handleInputChange={handleInputChange}
					/>
				)}
			</Container>
		</Container>
	);
};

export default memo(MainComponent);
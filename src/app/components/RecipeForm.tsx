"use client";
import { DeleteOutlined } from "@ant-design/icons";
import {
	Button,
	Col,
	Input,
	InputNumber,
	Modal,
	Row,
	Space,
	Typography,
	message,
} from "antd";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import styles from "../page.module.css";

const { Text, Title } = Typography;

export default function RecipeForm(props: {
	saveRecipe: () => void;
	recipeName: string;
	setRecipeName: Dispatch<SetStateAction<string>>;
	inputs: {
		id: number;
		placeholder: string;
		value: string;
	}[];
	setInputs: Dispatch<
		SetStateAction<
			{
				id: number;
				placeholder: string;
				value: string;
			}[]
		>
	>;
	groundsInput: {
		placeholder: string;
		value: string;
	};
	setGroundsInput: Dispatch<
		SetStateAction<{
			placeholder: string;
			value: string;
		}>
	>;
}) {
	const [targetGroundsInput, setTargetGroundsInput] = useState("");
	const [targetWaterAmounts, setTargetWaterAmounts] = useState<string[]>([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [messageApi, contextHolder] = message.useMessage();

	useEffect(() => {
		recalculateWaterAmounts(targetGroundsInput);
	}, [props.inputs, props.groundsInput, targetGroundsInput]);

	const recalculateWaterAmounts = (value: string) => {
		// Convert inputs to numbers
		const originalGrounds = parseFloat(props.groundsInput.value);
		const targetGrounds = parseFloat(value);

		if (
			isNaN(originalGrounds) ||
			isNaN(targetGrounds) ||
			originalGrounds === 0
		) {
			setTargetWaterAmounts([]);
			return;
		}

		// Calculate ratio between target and original grounds
		const ratio = targetGrounds / originalGrounds;

		// Calculate new water amounts
		const newWaterAmounts = props.inputs.map((input) => {
			const originalWater = parseFloat(input.value);
			if (isNaN(originalWater)) return "";
			return (originalWater * ratio).toFixed(1);
		});

		setTargetWaterAmounts(newWaterAmounts);
	};

	const handleAddInput = () => {
		if (props.inputs.length < 10) {
			const newId = props.inputs[props.inputs.length - 1].id + 1;
			props.setInputs([
				...props.inputs,
				{ id: newId, placeholder: "", value: "" },
			]);
		}
	};

	const handleRemoveInput = (id: number) => {
		if (props.inputs.length > 1) {
			props.setInputs(props.inputs.filter((input) => input.id !== id));
			setTargetWaterAmounts((prev) =>
				prev.filter((_, index) => props.inputs[index].id !== id)
			);
		}
	};

	const handleInputChange = (id: number, value: string) => {
		props.setInputs(
			props.inputs.map((input) => {
				if (input.id === id) {
					return { ...input, value };
				} else {
					return input;
				}
			})
		);
	};

	const success = () => {
		messageApi.open({
			type: "success",
			content: "Recipe saved successfully!",
		});
	};

	return (
		<>
			<Row gutter={[16, 16]} style={{ marginBottom: "1rem" }}>
				<Col span={11}>
					<Text>Original grounds</Text>
					<InputNumber
						key={"groundsInput"}
						type="number"
						value={props.groundsInput.value}
						onChange={(e) =>
							props.setGroundsInput({
								...props.groundsInput,
								value: e || "",
							})
						}
						style={{ width: "100%" }}
						addonAfter={"g"}
					/>
				</Col>
				<Col
					span={2}
					style={{
						textAlign: "center",
						alignSelf: "center",
						color: "#0070f3",
					}}
				>
					→
				</Col>
				<Col span={11}>
					<Text>Target grounds</Text>
					<InputNumber
						key={"targetGroundsInput"}
						type="number"
						onChange={(e) => setTargetGroundsInput(e?.toString() || "")}
						disabled={!props.groundsInput.value}
						style={{ width: "100%" }}
						addonAfter={"g"}
					/>
				</Col>
			</Row>

			{props.inputs.map((input, index) => (
				<Row gutter={[16, 16]}>
					<Col span={11}>
						<div key={input.id} className={styles.inputGroup}>
							<div
								className={styles.waterInputContainer}
								style={{ width: "100%" }}
							>
								<InputNumber
									type="number"
									value={input.value}
									onChange={(e) => handleInputChange(input.id, e || "")}
									placeholder="Water"
									style={{ width: "100%" }}
									addonAfter={"ml"}
								/>
								{props.inputs.length > 1 && (
									<Button
										type="text"
										danger
										shape="circle"
										onClick={() => handleRemoveInput(input.id)}
										icon={<DeleteOutlined />}
									/>
								)}
							</div>
						</div>
					</Col>
					<Col
						span={2}
						style={{
							textAlign: "center",
							alignSelf: "center",
							color: "#0070f3",
						}}
					>
						{targetWaterAmounts[index] && <div>→</div>}
					</Col>
					<Col
						span={11}
						style={{
							textAlign: "start",
							alignSelf: "center",
							color: "#0070f3",
						}}
					>
						{targetWaterAmounts[index] && (
							<div>{targetWaterAmounts[index]}ml</div>
						)}
					</Col>
				</Row>
			))}
			<Row gutter={[16, 16]} style={{ marginBottom: "1rem" }}>
				<Col span={11}>
					{/* Add Input Button */}
					{props.inputs.length < 10 && (
						<Button
							type="dashed"
							onClick={handleAddInput}
							style={{ width: "100%" }}
						>
							+ Add Pour
						</Button>
					)}
				</Col>
				<Col
					span={13}
					style={{
						textAlign: "center",
						alignSelf: "center",
						color: "#0070f3",
					}}
				/>
			</Row>
			<Space direction="vertical" style={{ width: "100%" }}>
				{/* Save Recipe Button and Modal */}
				<Button
					type="primary"
					onClick={() => setIsModalOpen(true)}
					disabled={
						!props.groundsInput.value ||
						props.inputs.some((input) => !input.value)
					}
					style={{ width: "100%" }}
				>
					Save Recipe
				</Button>
			</Space>

			{/* Modal for saving recipe */}
			<Modal
				open={isModalOpen}
				title="Save Recipe"
				onCancel={() => {
					setIsModalOpen(false);
					props.setRecipeName("");
				}}
				footer={(_, { CancelBtn }) => (
					<>
						<CancelBtn />
						<Button
							type="primary"
							onClick={() => {
								props.saveRecipe();
								setIsModalOpen(false);
								success();
							}}
							disabled={!props.recipeName}
						>
							Save
						</Button>
					</>
				)}
			>
				<Input
					type="text"
					value={props.recipeName}
					onChange={(e) => props.setRecipeName(e.target.value)}
					placeholder="Enter recipe name"
					autoFocus
				/>
			</Modal>
			{contextHolder}
		</>
	);
}

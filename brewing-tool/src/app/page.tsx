"use client";
import { useState } from "react";
import styles from "./page.module.css";

export default function Home() {
	const [groundsInput, setGroundsInput] = useState({
		placeholder: "Coffee grounds",
		value: "",
	});

	const [inputs, setInputs] = useState([
		{ id: 1, placeholder: "water amount", value: "" },
	]);
	const [targetWaterAmounts, setTargetWaterAmounts] = useState<string[]>([]);

	const handleAddInput = () => {
		if (inputs.length < 10) {
			const newId = inputs.length + 1;
			setInputs([...inputs, { id: newId, placeholder: "", value: "" }]);
		}
	};

	const handleInputChange = (id: number, value: string) => {
		setInputs(
			inputs.map((input) => {
				if (input.id === id) {
					return { ...input, value };
				} else {
					return input;
				}
			})
		);
	};

	const recalculateWaterAmounts = (value: string) => {
		// Convert inputs to numbers
		const originalGrounds = parseFloat(groundsInput.value);
		const targetGrounds = parseFloat(value);

		if (
			isNaN(originalGrounds) ||
			isNaN(targetGrounds) ||
			originalGrounds === 0
		) {
			return;
		}

		// Calculate ratio between target and original grounds
		const ratio = targetGrounds / originalGrounds;

		// Calculate new water amounts
		const newWaterAmounts = inputs.map((input) => {
			const originalWater = parseFloat(input.value);
			if (isNaN(originalWater)) return "";
			return (originalWater * ratio).toFixed(1);
		});

		setTargetWaterAmounts(newWaterAmounts);
	};

	return (
		<div className={styles.page}>
			<main className={styles.main}>
				<h1 className={styles.title}>Coffee Brewing Calculator</h1>
				<p className={styles.description}>
					Calculate water ratios for different coffee recipes
				</p>

				<div className={styles.card}>
					<div className={styles.section}>
						<h2>Original Recipe</h2>
						<input
							key={"groundsInput"}
							type="number"
							value={groundsInput.value}
							onChange={(e) =>
								setGroundsInput({
									...groundsInput,
									value: e.target.value,
								})
							}
							placeholder="Coffee grounds (g)"
							className={styles.input}
						/>
						{inputs.map((input, index) => (
							<div key={input.id} className={styles.inputGroup}>
								<input
									type="number"
									value={input.value}
									onChange={(e) => handleInputChange(input.id, e.target.value)}
									placeholder="Water amount (ml)"
									className={styles.input}
								/>
								{targetWaterAmounts[index] && (
									<div className={styles.targetAmount}>
										→ {targetWaterAmounts[index]}ml
									</div>
								)}
							</div>
						))}
						{inputs.length < 10 && (
							<button
								onClick={handleAddInput}
								className={styles.secondaryButton}
							>
								+ Add Water Input
							</button>
						)}
					</div>

					<div className={styles.section}>
						<h2>Target Recipe</h2>
						<input
							key={"targetGroundsInput"}
							type="number"
							onChange={(e) => {
								recalculateWaterAmounts(e.target.value);
							}}
							placeholder="Target coffee grounds (g)"
							className={styles.input}
						/>
					</div>
				</div>
			</main>
		</div>
	);
}

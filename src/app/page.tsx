"use client";
import { useEffect, useState } from "react";
import styles from "./page.module.css";

export default function Home() {
	const [groundsInput, setGroundsInput] = useState({
		placeholder: "Coffee grounds",
		value: "",
	});

	const [targetGroundsInput, setTargetGroundsInput] = useState("");

	const [inputs, setInputs] = useState([
		{ id: 1, placeholder: "water amount", value: "" },
	]);
	const [targetWaterAmounts, setTargetWaterAmounts] = useState<string[]>([]);

	const handleAddInput = () => {
		if (inputs.length < 10) {
			const newId = inputs[inputs.length - 1].id + 1;
			setInputs([...inputs, { id: newId, placeholder: "", value: "" }]);
		}
	};

	const handleRemoveInput = (id: number) => {
		if (inputs.length > 1) {
			setInputs(inputs.filter((input) => input.id !== id));
			setTargetWaterAmounts((prev) =>
				prev.filter((_, index) => inputs[index].id !== id)
			);
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

	useEffect(() => {
		recalculateWaterAmounts(targetGroundsInput);
	}, [inputs, groundsInput, targetGroundsInput]);

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
					<div className={styles.ratioDisplay}>
						{parseFloat(inputs[inputs.length - 1]?.value) &&
						parseFloat(groundsInput.value) ? (
							<>
								<h3 className={styles.ratioTitle}>Water to Coffee Ratio</h3>
								<div className={styles.ratioValue}>
									<span>1</span>
									<span>:</span>
									<span>
										{(
											parseFloat(inputs[inputs.length - 1].value) /
											parseFloat(groundsInput.value)
										).toFixed(1)}
									</span>
								</div>
							</>
						) : (
							<div className={styles.ratioPlaceholder}>
								Enter coffee and water amounts to see ratio
							</div>
						)}
					</div>
					<div>
						<div style={{ display: "flex", gap: "1rem" }}>
							<div className={styles.section}>
								<h2>Original Recipe</h2>
								<div className={styles.inputGroup}>
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
								</div>
							</div>
							<div className={styles.section}>
								<h2>Target Recipe</h2>
								<input
									key={"targetGroundsInput"}
									type="number"
									onChange={(e) => setTargetGroundsInput(e.target.value)}
									placeholder="Target coffee grounds (g)"
									className={styles.input}
								/>
							</div>
						</div>
						{inputs.map((input, index) => (
							<div key={input.id} className={styles.inputGroup}>
								<div className={styles.waterInputContainer}>
									<input
										type="number"
										value={input.value}
										onChange={(e) =>
											handleInputChange(input.id, e.target.value)
										}
										placeholder="Water amount (ml)"
										className={styles.input}
									/>
									{inputs.length > 1 && (
										<button
											onClick={() => handleRemoveInput(input.id)}
											className={styles.removeButton}
											aria-label="Remove water input"
										>
											×
										</button>
									)}
								</div>
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
				</div>
			</main>
		</div>
	);
}

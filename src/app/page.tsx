"use client";
import { useEffect, useState } from "react";
import styles from "./page.module.css";

interface Recipe {
	id: string;
	name: string;
	grounds: string;
	waterAmounts: Array<{ id: number; value: string }>;
}

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

	const [favorites, setFavorites] = useState<Recipe[]>([]);
	const [recipeName, setRecipeName] = useState("");

	const [isModalOpen, setIsModalOpen] = useState(false);

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

	const loadFavorites = () => {
		const saved = localStorage.getItem("coffeeRecipes");
		if (saved) {
			setFavorites(JSON.parse(saved));
		}
	};

	const saveRecipe = () => {
		if (
			!recipeName ||
			!groundsInput.value ||
			inputs.some((input) => !input.value)
		) {
			return;
		}

		const newRecipe: Recipe = {
			id: Date.now().toString(),
			name: recipeName,
			grounds: groundsInput.value,
			waterAmounts: inputs,
		};

		const updatedFavorites = [...favorites, newRecipe];
		setFavorites(updatedFavorites);
		localStorage.setItem("coffeeRecipes", JSON.stringify(updatedFavorites));
		setRecipeName("");
	};

	const loadRecipe = (recipe: Recipe) => {
		// Set recipe name
		setRecipeName(recipe.name);

		// Set grounds input
		setGroundsInput({ ...groundsInput, value: recipe.grounds });

		// Set water amounts
		setInputs(
			recipe.waterAmounts.map((amount) => ({
				id: amount.id,
				placeholder: "water amount",
				value: amount.value,
			}))
		);
	};

	const deleteRecipe = (id: string) => {
		const updatedFavorites = favorites.filter((recipe) => recipe.id !== id);
		setFavorites(updatedFavorites);
		localStorage.setItem("coffeeRecipes", JSON.stringify(updatedFavorites));

		// Clear current recipe if it's the one being deleted
		if (favorites.find((recipe) => recipe.id === id)?.name === recipeName) {
			setRecipeName("");
			setGroundsInput({ ...groundsInput, value: "" });
			setInputs([{ id: 1, placeholder: "water amount", value: "" }]);
		}
	};

	useEffect(() => {
		recalculateWaterAmounts(targetGroundsInput);
	}, [inputs, groundsInput, targetGroundsInput]);

	useEffect(() => {
		loadFavorites();
	}, []);

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
					<div className={styles.favoritesSection}>
						<h3 style={{ color: "#444" }}>My Favorites</h3>
						<div className={styles.favoritesWrapper}>
							<select
								className={styles.favoritesSelect}
								onChange={(e) => {
									const recipe = favorites.find((r) => r.id === e.target.value);
									if (recipe) loadRecipe(recipe);
								}}
								value={
									favorites.find((recipe) => recipe.name === recipeName)?.id ||
									""
								}
							>
								<option value="" disabled>
									{favorites.length > 0
										? "Select a recipe"
										: "No saved recipes"}
								</option>
								{favorites.map((recipe) => (
									<option key={recipe.id} value={recipe.id}>
										{recipe.name} ({recipe.grounds}g)
									</option>
								))}
							</select>
							{favorites.find((recipe) => recipe.name === recipeName) && (
								<button
									onClick={() => {
										const recipe = favorites.find((r) => r.name === recipeName);
										if (recipe) deleteRecipe(recipe.id);
									}}
									className={styles.deleteButton}
									title="Delete recipe"
								>
									✕
								</button>
							)}
						</div>
					</div>
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
										placeholder="Coffee grounds"
										className={styles.input}
									/>
									<span style={{ color: "#444" }}>g</span>
								</div>
							</div>
							<span
								style={{
									color: "#0070f3",
									fontWeight: 500,
									alignSelf: "center",
								}}
							>
								→
							</span>
							<div className={styles.section}>
								<h2>Target Recipe</h2>
								<div className={styles.inputGroup}>
									<input
										key={"targetGroundsInput"}
										type="number"
										onChange={(e) => setTargetGroundsInput(e.target.value)}
										placeholder="Target grounds"
										className={styles.input}
										disabled={!groundsInput.value}
									/>
									<span style={{ color: "#444" }}>g</span>
								</div>
							</div>
						</div>
						{inputs.map((input, index) => (
							<div key={input.id} className={styles.inputGroup}>
								<div
									className={styles.waterInputContainer}
									style={{ marginRight: "1rem" }}
								>
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
								+ Add Pour
							</button>
						)}
						{/* Save Recipe Button and Modal */}
						<button
							onClick={() => setIsModalOpen(true)}
							className={styles.saveButton}
							disabled={
								!groundsInput.value || inputs.some((input) => !input.value)
							}
						>
							Save Recipe
						</button>

						{/* Save Recipe Modal */}
						{isModalOpen && (
							<div className={styles.modalOverlay}>
								<div className={styles.modal}>
									<h3>Save Recipe</h3>
									<input
										type="text"
										value={recipeName}
										onChange={(e) => setRecipeName(e.target.value)}
										placeholder="Enter recipe name"
										className={styles.input}
										autoFocus
									/>
									<div className={styles.modalButtons}>
										<button
											onClick={() => {
												setIsModalOpen(false);
												setRecipeName("");
											}}
											className={styles.secondaryButton}
											style={{ marginTop: 0 }}
										>
											Cancel
										</button>
										<button
											onClick={() => {
												saveRecipe();
												setIsModalOpen(false);
											}}
											className={styles.primaryButton}
											disabled={!recipeName}
											style={{ height: "2.5rem" }}
										>
											Save
										</button>
									</div>
								</div>
							</div>
						)}
					</div>
				</div>
			</main>
		</div>
	);
}

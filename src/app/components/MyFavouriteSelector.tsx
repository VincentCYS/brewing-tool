"use client";
import { DeleteOutlined } from "@ant-design/icons";
import { Button, Select, Typography } from "antd";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import styles from "../page.module.css";

const { Title } = Typography;

interface Recipe {
	value: string;
	label: string;
	grounds: string;
	waterAmounts: Array<{ id: number; value: string }>;
}

export default function MyFavouriteSelector(props: {
	setInputs: Dispatch<
		SetStateAction<
			{
				id: number;
				placeholder: string;
				value: string;
			}[]
		>
	>;
	favorites: Recipe[];
	setFavorites: Dispatch<SetStateAction<Recipe[]>>;
	groundsInput: string;
	setGroundsInput: Dispatch<SetStateAction<string>>;
}) {
	const [recipeName, setRecipeName] = useState("");

	const loadFavorites = () => {
		const saved = localStorage.getItem("coffeeRecipes");
		if (saved) {
			props.setFavorites(JSON.parse(saved));
		}
	};

	const loadRecipe = (recipe: Recipe) => {
		// Set recipe name
		setRecipeName(recipe.label);

		// Set grounds input
		props.setGroundsInput(recipe.grounds);

		// Set water amounts
		props.setInputs(
			recipe.waterAmounts.map((amount) => ({
				id: amount.id,
				placeholder: "water amount",
				value: amount.value,
			}))
		);
	};

	const deleteRecipe = (id: string) => {
		const updatedFavorites = props.favorites.filter(
			(recipe) => recipe.value !== id
		);
		props.setFavorites(updatedFavorites);
		localStorage.setItem("coffeeRecipes", JSON.stringify(updatedFavorites));

		// Clear current recipe if it's the one being deleted
		if (
			props.favorites.find((recipe) => recipe.value === id)?.label ===
			recipeName
		) {
			setRecipeName("");
			props.setGroundsInput("");
			props.setInputs([{ id: 1, placeholder: "water amount", value: "" }]);
		}
	};

	useEffect(() => {
		loadFavorites();
	}, [recipeName]);

	return (
		<div className={styles.favoritesSection}>
			<Title level={5}>My Favorites</Title>
			<div className={styles.favoritesWrapper}>
				<Select
					onChange={(id) => {
						const recipe = props.favorites.find((r) => r.value === id);
						if (recipe) loadRecipe(recipe);
					}}
					options={props.favorites}
					placeholder="Select recipe"
					style={{ width: "100%" }}
				/>

				{props.favorites.find((recipe) => recipe.label === recipeName) && (
					<Button
						type="text"
						onClick={() => {
							const recipe = props.favorites.find(
								(r) => r.label === recipeName
							);
							if (recipe) deleteRecipe(recipe.value);
						}}
						icon={<DeleteOutlined />}
					/>
				)}
			</div>
		</div>
	);
}

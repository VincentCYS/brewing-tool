"use client";
import { DeleteOutlined } from "@ant-design/icons";
import { Button, Select, Typography } from "antd";
import {
	Dispatch,
	SetStateAction,
	useContext,
	useEffect,
	useState,
} from "react";
import { receips } from "../constants/defaultRecipes";
import { InputsContext } from "../page";
import styles from "../page.module.css";
import { Recipe } from "../types/Recipe";

const { Title } = Typography;

export default function MyFavouriteSelector(props: {
	favorites: Recipe[];
	setFavorites: Dispatch<SetStateAction<Recipe[]>>;
}) {
	const [recipeName, setRecipeName] = useState("");
	const { setInputs, groundsInput, setGroundsInput }: any =
		useContext(InputsContext);

	const loadFavorites = () => {
		const saved = localStorage.getItem("coffeeRecipes");
		if (saved && props.favorites.length === 3) {
			const fav = props.favorites.concat(JSON.parse(saved));
			props.setFavorites(fav);
		}
	};

	const loadRecipe = (recipe: Recipe) => {
		// Set recipe name
		setRecipeName(recipe.label);

		// Set grounds input
		setGroundsInput(recipe.grounds);

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
		const updatedFavorites = props.favorites.filter(
			(recipe) => recipe.value !== id
		);
		props.setFavorites(updatedFavorites);

		localStorage.setItem(
			"coffeeRecipes",
			JSON.stringify(
				updatedFavorites.slice(receips.length, updatedFavorites.length)
			)
		);

		// Clear current recipe if it's the one being deleted
		if (
			props.favorites.find((recipe) => recipe.value === id)?.label ===
			recipeName
		) {
			setRecipeName("");
			setGroundsInput("");
			setInputs([{ id: 1, placeholder: "water amount", value: "" }]);
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

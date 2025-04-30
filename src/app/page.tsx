"use client";
import { Divider, Layout, Typography } from "antd";
import { useState } from "react";
import MyFavouriteSelector from "./components/MyFavouriteSelector";
import RecipeForm from "./components/RecipeForm";

const { Header, Content } = Layout;
const { Text, Title } = Typography;

interface Recipe {
	value: string;
	label: string;
	grounds: string;
	waterAmounts: Array<{ id: number; value: string }>;
}

export default function Home() {
	const [groundsInput, setGroundsInput] = useState("");

	const [inputs, setInputs] = useState([
		{ id: 1, placeholder: "water amount", value: "" },
	]);
	const [favorites, setFavorites] = useState<Recipe[]>([]);
	const [recipeName, setRecipeName] = useState("");

	const saveRecipe = () => {
		if (!recipeName || !groundsInput || inputs.some((input) => !input.value)) {
			return;
		}

		const newRecipe: Recipe = {
			value: Date.now().toString(),
			label: recipeName,
			grounds: groundsInput,
			waterAmounts: inputs,
		};

		const updatedFavorites = [...favorites, newRecipe];
		localStorage.setItem("coffeeRecipes", JSON.stringify(updatedFavorites));
		setFavorites(updatedFavorites);
		setRecipeName("");
	};

	return (
		<Layout style={{ minHeight: "100vh" }}>
			<Header
				style={{ display: "flex", alignItems: "center", marginBottom: 20 }}
			>
				<Title level={4} style={{ color: "#fff", margin: 0 }}>
					Coffee Brewing Tool
				</Title>
			</Header>
			<Content style={{ padding: "0 5%" }}>
				<Title level={3}>Brewing Ratio Calculator</Title>
				<Text>
					Use this tool to easily recalculate the water-to-coffee ratio for your
					favorite brewing recipes. Enter your desired amount of coffee grounds
					and water, save your recipes, and quickly adjust ratios for perfect
					coffee every time.
				</Text>

				<Divider />

				<MyFavouriteSelector
					setInputs={setInputs}
					favorites={favorites}
					setFavorites={setFavorites}
					groundsInput={groundsInput}
					setGroundsInput={setGroundsInput}
				/>

				<RecipeForm
					saveRecipe={saveRecipe}
					recipeName={recipeName}
					setRecipeName={setRecipeName}
					inputs={inputs}
					setInputs={setInputs}
					groundsInput={groundsInput}
					setGroundsInput={setGroundsInput}
				/>
			</Content>
		</Layout>
	);
}

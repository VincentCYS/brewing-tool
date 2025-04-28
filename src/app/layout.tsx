import { Layout } from "antd";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const { Header, Footer, Sider, Content } = Layout;

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Brewing Calculator",
	description: "Coffee brewing calculator",
};

const headerStyle: React.CSSProperties = {
	textAlign: "center",
	color: "#fff",
	height: 64,
	paddingInline: 48,
	lineHeight: "64px",
	backgroundColor: "#4096ff",
};

const contentStyle: React.CSSProperties = {
	textAlign: "center",
	minHeight: 120,
	lineHeight: "120px",
	color: "#fff",
	backgroundColor: "#0958d9",
};

const siderStyle: React.CSSProperties = {
	textAlign: "center",
	lineHeight: "120px",
	color: "#fff",
	backgroundColor: "#1677ff",
};

const footerStyle: React.CSSProperties = {
	textAlign: "center",
	color: "#fff",
	backgroundColor: "#4096ff",
};

const layoutStyle = {
	borderRadius: 8,
	overflow: "hidden",
	width: "calc(50% - 8px)",
	maxWidth: "calc(50% - 8px)",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${geistSans.variable} ${geistMono.variable}`}>
				{children}
			</body>
		</html>
	);
}

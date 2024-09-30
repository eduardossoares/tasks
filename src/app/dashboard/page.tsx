// Este código roda no servidor, permitindo exportar o metadata
import type { Metadata } from "next";
import DashboardComponent from "../components/dashboard/DashboardComponent";

// Metadados continuam sendo exportados do lado do servidor
export const metadata: Metadata = {
    title: 'Dashboard',
};

// Arquivo separado para o componente cliente

export default function Page() {
    return <DashboardComponent />;
}

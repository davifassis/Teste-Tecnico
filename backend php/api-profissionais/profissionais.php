<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include 'db.php';

// Verifica o método da requisição
$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        // Se tiver um ID, busca um único profissional
        if (isset($_GET['id'])) {
            $id = $_GET['id'];
            $query = "SELECT * FROM profissionais WHERE id = :id";
            $stmt = $conn->prepare($query);
            $stmt->bindParam(":id", $id);
            $stmt->execute();
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            echo json_encode($result);
        } else {
            // Busca todos os profissionais
            $query = "SELECT * FROM profissionais";
            $stmt = $conn->prepare($query);
            $stmt->execute();
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($result);
        }
        break;

    case 'POST':
        // Insere um novo profissional
        $data = json_decode(file_get_contents("php://input"));
        $query = "INSERT INTO profissionais (nome, especialidade, crm, contato, email, data_contratacao, inicio_atendimento, fim_atendimento, status, dias_da_semana) 
                    VALUES (:nome, :especialidade, :crm, :contato, :email, :data_contratacao, :inicio_atendimento, :fim_atendimento, :status, :dias_da_semana)";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(":nome", $data->nome);
        $stmt->bindParam(":especialidade", $data->especialidade);
        $stmt->bindParam(":crm", $data->crm);
        $stmt->bindParam(":contato", $data->contato);
        $stmt->bindParam(":email", $data->email);
        $stmt->bindParam(":data_contratacao", $data->dataContratacao); // Ajustado
        $stmt->bindParam(":inicio_atendimento", $data->inicioAtendimento); // Ajustado
        $stmt->bindParam(":fim_atendimento", $data->fimAtendimento); // Ajustado
        $stmt->bindParam(":status", $data->status);
        $stmt->bindParam(":dias_da_semana", $data->dias_da_semana); // Adicionado aqui
        if ($stmt->execute()) {
            echo json_encode(["message" => "Profissional criado com sucesso."]);
        } else {
            echo json_encode(["message" => "Erro ao criar profissional."]);
        }
        break;

    case 'PUT':
        // Atualiza um profissional existente
        $data = json_decode(file_get_contents("php://input"));
        $id = isset($_GET['id']) ? $_GET['id'] : die();
        $query = "UPDATE profissionais SET nome = :nome, especialidade = :especialidade, crm = :crm, contato = :contato, 
                    email = :email, data_contratacao = :data_contratacao, inicio_atendimento = :inicio_atendimento, 
                    fim_atendimento = :fim_atendimento, status = :status, dias_da_semana = :dias_da_semana WHERE id = :id";
                    
        $stmt = $conn->prepare($query);
        $stmt->bindParam(":nome", $data->nome);
        $stmt->bindParam(":especialidade", $data->especialidade);
        $stmt->bindParam(":crm", $data->crm);
        $stmt->bindParam(":contato", $data->contato);
        $stmt->bindParam(":email", $data->email);
        $stmt->bindParam(":data_contratacao", $data->dataContratacao); // Ajustado
        $stmt->bindParam(":inicio_atendimento", $data->inicioAtendimento); // Ajustado
        $stmt->bindParam(":fim_atendimento", $data->fimAtendimento); // Ajustado
        $stmt->bindParam(":status", $data->status);
        $stmt->bindParam(":dias_da_semana", $data->dias_da_semana); // Adicionado aqui
        $stmt->bindParam(":id", $id);
        if ($stmt->execute()) {
            echo json_encode(["message" => "Profissional atualizado com sucesso."]);
        } else {
            echo json_encode(["message" => "Erro ao atualizar profissional."]);
        }
        break;

    case 'DELETE':
        // Exclui um profissional
        $id = isset($_GET['id']) ? $_GET['id'] : die();
        $query = "DELETE FROM profissionais WHERE id = :id";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(":id", $id);
        if ($stmt->execute()) {
            echo json_encode(["message" => "Profissional excluído com sucesso."]);
        } else {
            echo json_encode(["message" => "Erro ao excluir profissional."]);
        }
        break;

    default:
        echo json_encode(["message" => "Método não permitido"]);
        break;
}
?>
package main

import (
	"encoding/json"
	"fmt"

	//  "byte"

	"github.com/google/uuid"
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// SmartContract provides functions for managing a car
type SmartContract struct {
	contractapi.Contract
}
type QueryBar struct {
	Key    string `json:"Key"`
	Record *Bar
}
type Bar struct {
	BlockchainTokenId string `json:"id"`
	OrderId           string `json:"orderId"`
	TotalKgs          string `json:"totalKgs"`
	DwrReceiptId      string `json:"dwrReceiptId"`
	UserId            string `json:"userId"`
}

// Genarate UId
func GetUID() (string, error) {
	id, err := uuid.NewUUID()
	if err != nil {
		return "", err
	}
	return id.String(), err
}

// InitLedger adds a base set of cars to the ledger
func (s *SmartContract) Init(ctx contractapi.TransactionContextInterface) error {
	fmt.Printf("Hello\n")
	return nil
}

// InitLedger adds a base set of cars to the ledger
func (s *SmartContract) CreateBar(ctx contractapi.TransactionContextInterface, OrderId string, TotalKgs string, DwrReceiptId string, UserId string) error {

	fmt.Printf("Adding Bar to the ledger ...\n")
	// if len(args) != 8 {
	// 	return fmt.Errorf("InvalidArgumentError: Incorrect number of arguments. Expecting 8")
	// }

	//Prepare key for the new Org
	uid, err := GetUID()
	if err != nil {
		return fmt.Errorf("%s", err)
	}
	id := "DSG-" + uid
	fmt.Printf("Validating Bar data\n")
	//Validate the Org data
	var bar = Bar{BlockchainTokenId: id,
		OrderId:      OrderId,
		TotalKgs:     TotalKgs,
		DwrReceiptId: DwrReceiptId,
		UserId:       UserId,
	}

	//Encrypt and Marshal Org data in order to put in world state
	barAsBytes, _ := json.Marshal(bar)

	return ctx.GetStub().PutState(id, barAsBytes)
}

// QueryCar returns the car stored in the world state with given id
func (s *SmartContract) GetBar(ctx contractapi.TransactionContextInterface, OrderId string) ([]QueryBar, error) {
	query := "{\"selector\": {\"_id\": {\"$regex\": \"^Bar-\"} } }"
	resultsIterator, err := ctx.GetStub().GetQueryResult(query)
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()
	result := []QueryBar{}
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}
		bar := new(Bar)
		_ = json.Unmarshal(queryResponse.Value, bar)
		if bar.OrderId == OrderId {

			queryResult := QueryBar{Key: queryResponse.Key, Record: bar}
			result = append(result, queryResult)
		}
	}
	return result, nil
}

// QueryCar returns the car stored in the world state with given id
func (s *SmartContract) QueryBar(ctx contractapi.TransactionContextInterface, OrderId string) (*Bar, error) {
	barAsBytes, err := ctx.GetStub().GetState(OrderId)

	if err != nil {
		return nil, fmt.Errorf("Failed to read from world state. %s", err.Error())
	}

	if barAsBytes == nil {
		return nil, fmt.Errorf("%s does not exist", OrderId)
	}

	bar := new(Bar)
	_ = json.Unmarshal(barAsBytes, bar)

	return bar, nil
}

// QueryCar returns the car stored in the world state with given id
func (s *SmartContract) GetBarList(ctx contractapi.TransactionContextInterface) ([]QueryBar, error) {
	query := "{\"selector\": {\"_id\": {\"$regex\": \"^Bar-\"} } }"
	resultsIterator, err := ctx.GetStub().GetQueryResult(query)
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()
	results := []QueryBar{}
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}
		bar := new(Bar)
		_ = json.Unmarshal(queryResponse.Value, bar)
		queryResult := QueryBar{Key: queryResponse.Key, Record: bar}
		results = append(results, queryResult)
	}
	return results, nil
}
func main() {

	chaincode, err := contractapi.NewChaincode(new(SmartContract))

	if err != nil {
		fmt.Printf("Error create  chaincode: %s", err.Error())
		return
	}

	if err := chaincode.Start(); err != nil {
		fmt.Printf("Error starting  chaincode: %s", err.Error())
	}
}

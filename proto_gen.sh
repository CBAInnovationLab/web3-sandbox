#!/bin/bash

protoc --proto_path=src/schema --js_out=import_style=commonjs,binary:build src/schema/order.proto
solpb src/schema/order.proto >> build/contracts.concat.json



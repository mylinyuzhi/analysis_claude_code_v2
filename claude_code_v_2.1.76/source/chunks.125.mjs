
// @from(Ln 308637, Col 4)
BC8 = x((hWw, kjY) => {
    kjY.exports = {
        nested: {
            google: {
                nested: {
                    protobuf: {
                        options: {
                            go_package: "google.golang.org/protobuf/types/descriptorpb",
                            java_package: "com.google.protobuf",
                            java_outer_classname: "DescriptorProtos",
                            csharp_namespace: "Google.Protobuf.Reflection",
                            objc_class_prefix: "GPB",
                            cc_enable_arenas: !0,
                            optimize_for: "SPEED"
                        },
                        nested: {
                            FileDescriptorSet: {
                                edition: "proto2",
                                fields: {
                                    file: {
                                        rule: "repeated",
                                        type: "FileDescriptorProto",
                                        id: 1
                                    }
                                },
                                extensions: [
                                    [536000000, 536000000]
                                ]
                            },
                            Edition: {
                                edition: "proto2",
                                values: {
                                    EDITION_UNKNOWN: 0,
                                    EDITION_LEGACY: 900,
                                    EDITION_PROTO2: 998,
                                    EDITION_PROTO3: 999,
                                    EDITION_2023: 1000,
                                    EDITION_2024: 1001,
                                    EDITION_1_TEST_ONLY: 1,
                                    EDITION_2_TEST_ONLY: 2,
                                    EDITION_99997_TEST_ONLY: 99997,
                                    EDITION_99998_TEST_ONLY: 99998,
                                    EDITION_99999_TEST_ONLY: 99999,
                                    EDITION_MAX: 2147483647
                                }
                            },
                            FileDescriptorProto: {
                                edition: "proto2",
                                fields: {
                                    name: {
                                        type: "string",
                                        id: 1
                                    },
                                    package: {
                                        type: "string",
                                        id: 2
                                    },
                                    dependency: {
                                        rule: "repeated",
                                        type: "string",
                                        id: 3
                                    },
                                    publicDependency: {
                                        rule: "repeated",
                                        type: "int32",
                                        id: 10
                                    },
                                    weakDependency: {
                                        rule: "repeated",
                                        type: "int32",
                                        id: 11
                                    },
                                    optionDependency: {
                                        rule: "repeated",
                                        type: "string",
                                        id: 15
                                    },
                                    messageType: {
                                        rule: "repeated",
                                        type: "DescriptorProto",
                                        id: 4
                                    },
                                    enumType: {
                                        rule: "repeated",
                                        type: "EnumDescriptorProto",
                                        id: 5
                                    },
                                    service: {
                                        rule: "repeated",
                                        type: "ServiceDescriptorProto",
                                        id: 6
                                    },
                                    extension: {
                                        rule: "repeated",
                                        type: "FieldDescriptorProto",
                                        id: 7
                                    },
                                    options: {
                                        type: "FileOptions",
                                        id: 8
                                    },
                                    sourceCodeInfo: {
                                        type: "SourceCodeInfo",
                                        id: 9
                                    },
                                    syntax: {
                                        type: "string",
                                        id: 12
                                    },
                                    edition: {
                                        type: "Edition",
                                        id: 14
                                    }
                                }
                            },
                            DescriptorProto: {
                                edition: "proto2",
                                fields: {
                                    name: {
                                        type: "string",
                                        id: 1
                                    },
                                    field: {
                                        rule: "repeated",
                                        type: "FieldDescriptorProto",
                                        id: 2
                                    },
                                    extension: {
                                        rule: "repeated",
                                        type: "FieldDescriptorProto",
                                        id: 6
                                    },
                                    nestedType: {
                                        rule: "repeated",
                                        type: "DescriptorProto",
                                        id: 3
                                    },
                                    enumType: {
                                        rule: "repeated",
                                        type: "EnumDescriptorProto",
                                        id: 4
                                    },
                                    extensionRange: {
                                        rule: "repeated",
                                        type: "ExtensionRange",
                                        id: 5
                                    },
                                    oneofDecl: {
                                        rule: "repeated",
                                        type: "OneofDescriptorProto",
                                        id: 8
                                    },
                                    options: {
                                        type: "MessageOptions",
                                        id: 7
                                    },
                                    reservedRange: {
                                        rule: "repeated",
                                        type: "ReservedRange",
                                        id: 9
                                    },
                                    reservedName: {
                                        rule: "repeated",
                                        type: "string",
                                        id: 10
                                    },
                                    visibility: {
                                        type: "SymbolVisibility",
                                        id: 11
                                    }
                                },
                                nested: {
                                    ExtensionRange: {
                                        fields: {
                                            start: {
                                                type: "int32",
                                                id: 1
                                            },
                                            end: {
                                                type: "int32",
                                                id: 2
                                            },
                                            options: {
                                                type: "ExtensionRangeOptions",
                                                id: 3
                                            }
                                        }
                                    },
                                    ReservedRange: {
                                        fields: {
                                            start: {
                                                type: "int32",
                                                id: 1
                                            },
                                            end: {
                                                type: "int32",
                                                id: 2
                                            }
                                        }
                                    }
                                }
                            },
                            ExtensionRangeOptions: {
                                edition: "proto2",
                                fields: {
                                    uninterpretedOption: {
                                        rule: "repeated",
                                        type: "UninterpretedOption",
                                        id: 999
                                    },
                                    declaration: {
                                        rule: "repeated",
                                        type: "Declaration",
                                        id: 2,
                                        options: {
                                            retention: "RETENTION_SOURCE"
                                        }
                                    },
                                    features: {
                                        type: "FeatureSet",
                                        id: 50
                                    },
                                    verification: {
                                        type: "VerificationState",
                                        id: 3,
                                        options: {
                                            default: "UNVERIFIED",
                                            retention: "RETENTION_SOURCE"
                                        }
                                    }
                                },
                                extensions: [
                                    [1000, 536870911]
                                ],
                                nested: {
                                    Declaration: {
                                        fields: {
                                            number: {
                                                type: "int32",
                                                id: 1
                                            },
                                            fullName: {
                                                type: "string",
                                                id: 2
                                            },
                                            type: {
                                                type: "string",
                                                id: 3
                                            },
                                            reserved: {
                                                type: "bool",
                                                id: 5
                                            },
                                            repeated: {
                                                type: "bool",
                                                id: 6
                                            }
                                        },
                                        reserved: [
                                            [4, 4]
                                        ]
                                    },
                                    VerificationState: {
                                        values: {
                                            DECLARATION: 0,
                                            UNVERIFIED: 1
                                        }
                                    }
                                }
                            },
                            FieldDescriptorProto: {
                                edition: "proto2",
                                fields: {
                                    name: {
                                        type: "string",
                                        id: 1
                                    },
                                    number: {
                                        type: "int32",
                                        id: 3
                                    },
                                    label: {
                                        type: "Label",
                                        id: 4
                                    },
                                    type: {
                                        type: "Type",
                                        id: 5
                                    },
                                    typeName: {
                                        type: "string",
                                        id: 6
                                    },
                                    extendee: {
                                        type: "string",
                                        id: 2
                                    },
                                    defaultValue: {
                                        type: "string",
                                        id: 7
                                    },
                                    oneofIndex: {
                                        type: "int32",
                                        id: 9
                                    },
                                    jsonName: {
                                        type: "string",
                                        id: 10
                                    },
                                    options: {
                                        type: "FieldOptions",
                                        id: 8
                                    },
                                    proto3Optional: {
                                        type: "bool",
                                        id: 17
                                    }
                                },
                                nested: {
                                    Type: {
                                        values: {
                                            TYPE_DOUBLE: 1,
                                            TYPE_FLOAT: 2,
                                            TYPE_INT64: 3,
                                            TYPE_UINT64: 4,
                                            TYPE_INT32: 5,
                                            TYPE_FIXED64: 6,
                                            TYPE_FIXED32: 7,
                                            TYPE_BOOL: 8,
                                            TYPE_STRING: 9,
                                            TYPE_GROUP: 10,
                                            TYPE_MESSAGE: 11,
                                            TYPE_BYTES: 12,
                                            TYPE_UINT32: 13,
                                            TYPE_ENUM: 14,
                                            TYPE_SFIXED32: 15,
                                            TYPE_SFIXED64: 16,
                                            TYPE_SINT32: 17,
                                            TYPE_SINT64: 18
                                        }
                                    },
                                    Label: {
                                        values: {
                                            LABEL_OPTIONAL: 1,
                                            LABEL_REPEATED: 3,
                                            LABEL_REQUIRED: 2
                                        }
                                    }
                                }
                            },
                            OneofDescriptorProto: {
                                edition: "proto2",
                                fields: {
                                    name: {
                                        type: "string",
                                        id: 1
                                    },
                                    options: {
                                        type: "OneofOptions",
                                        id: 2
                                    }
                                }
                            },
                            EnumDescriptorProto: {
                                edition: "proto2",
                                fields: {
                                    name: {
                                        type: "string",
                                        id: 1
                                    },
                                    value: {
                                        rule: "repeated",
                                        type: "EnumValueDescriptorProto",
                                        id: 2
                                    },
                                    options: {
                                        type: "EnumOptions",
                                        id: 3
                                    },
                                    reservedRange: {
                                        rule: "repeated",
                                        type: "EnumReservedRange",
                                        id: 4
                                    },
                                    reservedName: {
                                        rule: "repeated",
                                        type: "string",
                                        id: 5
                                    },
                                    visibility: {
                                        type: "SymbolVisibility",
                                        id: 6
                                    }
                                },
                                nested: {
                                    EnumReservedRange: {
                                        fields: {
                                            start: {
                                                type: "int32",
                                                id: 1
                                            },
                                            end: {
                                                type: "int32",
                                                id: 2
                                            }
                                        }
                                    }
                                }
                            },
                            EnumValueDescriptorProto: {
                                edition: "proto2",
                                fields: {
                                    name: {
                                        type: "string",
                                        id: 1
                                    },
                                    number: {
                                        type: "int32",
                                        id: 2
                                    },
                                    options: {
                                        type: "EnumValueOptions",
                                        id: 3
                                    }
                                }
                            },
                            ServiceDescriptorProto: {
                                edition: "proto2",
                                fields: {
                                    name: {
                                        type: "string",
                                        id: 1
                                    },
                                    method: {
                                        rule: "repeated",
                                        type: "MethodDescriptorProto",
                                        id: 2
                                    },
                                    options: {
                                        type: "ServiceOptions",
                                        id: 3
                                    }
                                }
                            },
                            MethodDescriptorProto: {
                                edition: "proto2",
                                fields: {
                                    name: {
                                        type: "string",
                                        id: 1
                                    },
                                    inputType: {
                                        type: "string",
                                        id: 2
                                    },
                                    outputType: {
                                        type: "string",
                                        id: 3
                                    },
                                    options: {
                                        type: "MethodOptions",
                                        id: 4
                                    },
                                    clientStreaming: {
                                        type: "bool",
                                        id: 5
                                    },
                                    serverStreaming: {
                                        type: "bool",
                                        id: 6
                                    }
                                }
                            },
                            FileOptions: {
                                edition: "proto2",
                                fields: {
                                    javaPackage: {
                                        type: "string",
                                        id: 1
                                    },
                                    javaOuterClassname: {
                                        type: "string",
                                        id: 8
                                    },
                                    javaMultipleFiles: {
                                        type: "bool",
                                        id: 10
                                    },
                                    javaGenerateEqualsAndHash: {
                                        type: "bool",
                                        id: 20,
                                        options: {
                                            deprecated: !0
                                        }
                                    },
                                    javaStringCheckUtf8: {
                                        type: "bool",
                                        id: 27
                                    },
                                    optimizeFor: {
                                        type: "OptimizeMode",
                                        id: 9,
                                        options: {
                                            default: "SPEED"
                                        }
                                    },
                                    goPackage: {
                                        type: "string",
                                        id: 11
                                    },
                                    ccGenericServices: {
                                        type: "bool",
                                        id: 16
                                    },
                                    javaGenericServices: {
                                        type: "bool",
                                        id: 17
                                    },
                                    pyGenericServices: {
                                        type: "bool",
                                        id: 18
                                    },
                                    deprecated: {
                                        type: "bool",
                                        id: 23
                                    },
                                    ccEnableArenas: {
                                        type: "bool",
                                        id: 31,
                                        options: {
                                            default: !0
                                        }
                                    },
                                    objcClassPrefix: {
                                        type: "string",
                                        id: 36
                                    },
                                    csharpNamespace: {
                                        type: "string",
                                        id: 37
                                    },
                                    swiftPrefix: {
                                        type: "string",
                                        id: 39
                                    },
                                    phpClassPrefix: {
                                        type: "string",
                                        id: 40
                                    },
                                    phpNamespace: {
                                        type: "string",
                                        id: 41
                                    },
                                    phpMetadataNamespace: {
                                        type: "string",
                                        id: 44
                                    },
                                    rubyPackage: {
                                        type: "string",
                                        id: 45
                                    },
                                    features: {
                                        type: "FeatureSet",
                                        id: 50
                                    },
                                    uninterpretedOption: {
                                        rule: "repeated",
                                        type: "UninterpretedOption",
                                        id: 999
                                    }
                                },
                                extensions: [
                                    [1000, 536870911]
                                ],
                                reserved: [
                                    [42, 42],
                                    [38, 38], "php_generic_services"
                                ],
                                nested: {
                                    OptimizeMode: {
                                        values: {
                                            SPEED: 1,
                                            CODE_SIZE: 2,
                                            LITE_RUNTIME: 3
                                        }
                                    }
                                }
                            },
                            MessageOptions: {
                                edition: "proto2",
                                fields: {
                                    messageSetWireFormat: {
                                        type: "bool",
                                        id: 1
                                    },
                                    noStandardDescriptorAccessor: {
                                        type: "bool",
                                        id: 2
                                    },
                                    deprecated: {
                                        type: "bool",
                                        id: 3
                                    },
                                    mapEntry: {
                                        type: "bool",
                                        id: 7
                                    },
                                    deprecatedLegacyJsonFieldConflicts: {
                                        type: "bool",
                                        id: 11,
                                        options: {
                                            deprecated: !0
                                        }
                                    },
                                    features: {
                                        type: "FeatureSet",
                                        id: 12
                                    },
                                    uninterpretedOption: {
                                        rule: "repeated",
                                        type: "UninterpretedOption",
                                        id: 999
                                    }
                                },
                                extensions: [
                                    [1000, 536870911]
                                ],
                                reserved: [
                                    [4, 4],
                                    [5, 5],
                                    [6, 6],
                                    [8, 8],
                                    [9, 9]
                                ]
                            },
                            FieldOptions: {
                                edition: "proto2",
                                fields: {
                                    ctype: {
                                        type: "CType",
                                        id: 1,
                                        options: {
                                            default: "STRING"
                                        }
                                    },
                                    packed: {
                                        type: "bool",
                                        id: 2
                                    },
                                    jstype: {
                                        type: "JSType",
                                        id: 6,
                                        options: {
                                            default: "JS_NORMAL"
                                        }
                                    },
                                    lazy: {
                                        type: "bool",
                                        id: 5
                                    },
                                    unverifiedLazy: {
                                        type: "bool",
                                        id: 15
                                    },
                                    deprecated: {
                                        type: "bool",
                                        id: 3
                                    },
                                    weak: {
                                        type: "bool",
                                        id: 10,
                                        options: {
                                            deprecated: !0
                                        }
                                    },
                                    debugRedact: {
                                        type: "bool",
                                        id: 16
                                    },
                                    retention: {
                                        type: "OptionRetention",
                                        id: 17
                                    },
                                    targets: {
                                        rule: "repeated",
                                        type: "OptionTargetType",
                                        id: 19
                                    },
                                    editionDefaults: {
                                        rule: "repeated",
                                        type: "EditionDefault",
                                        id: 20
                                    },
                                    features: {
                                        type: "FeatureSet",
                                        id: 21
                                    },
                                    featureSupport: {
                                        type: "FeatureSupport",
                                        id: 22
                                    },
                                    uninterpretedOption: {
                                        rule: "repeated",
                                        type: "UninterpretedOption",
                                        id: 999
                                    }
                                },
                                extensions: [
                                    [1000, 536870911]
                                ],
                                reserved: [
                                    [4, 4],
                                    [18, 18]
                                ],
                                nested: {
                                    CType: {
                                        values: {
                                            STRING: 0,
                                            CORD: 1,
                                            STRING_PIECE: 2
                                        }
                                    },
                                    JSType: {
                                        values: {
                                            JS_NORMAL: 0,
                                            JS_STRING: 1,
                                            JS_NUMBER: 2
                                        }
                                    },
                                    OptionRetention: {
                                        values: {
                                            RETENTION_UNKNOWN: 0,
                                            RETENTION_RUNTIME: 1,
                                            RETENTION_SOURCE: 2
                                        }
                                    },
                                    OptionTargetType: {
                                        values: {
                                            TARGET_TYPE_UNKNOWN: 0,
                                            TARGET_TYPE_FILE: 1,
                                            TARGET_TYPE_EXTENSION_RANGE: 2,
                                            TARGET_TYPE_MESSAGE: 3,
                                            TARGET_TYPE_FIELD: 4,
                                            TARGET_TYPE_ONEOF: 5,
                                            TARGET_TYPE_ENUM: 6,
                                            TARGET_TYPE_ENUM_ENTRY: 7,
                                            TARGET_TYPE_SERVICE: 8,
                                            TARGET_TYPE_METHOD: 9
                                        }
                                    },
                                    EditionDefault: {
                                        fields: {
                                            edition: {
                                                type: "Edition",
                                                id: 3
                                            },
                                            value: {
                                                type: "string",
                                                id: 2
                                            }
                                        }
                                    },
                                    FeatureSupport: {
                                        fields: {
                                            editionIntroduced: {
                                                type: "Edition",
                                                id: 1
                                            },
                                            editionDeprecated: {
                                                type: "Edition",
                                                id: 2
                                            },
                                            deprecationWarning: {
                                                type: "string",
                                                id: 3
                                            },
                                            editionRemoved: {
                                                type: "Edition",
                                                id: 4
                                            }
                                        }
                                    }
                                }
                            },
                            OneofOptions: {
                                edition: "proto2",
                                fields: {
                                    features: {
                                        type: "FeatureSet",
                                        id: 1
                                    },
                                    uninterpretedOption: {
                                        rule: "repeated",
                                        type: "UninterpretedOption",
                                        id: 999
                                    }
                                },
                                extensions: [
                                    [1000, 536870911]
                                ]
                            },
                            EnumOptions: {
                                edition: "proto2",
                                fields: {
                                    allowAlias: {
                                        type: "bool",
                                        id: 2
                                    },
                                    deprecated: {
                                        type: "bool",
                                        id: 3
                                    },
                                    deprecatedLegacyJsonFieldConflicts: {
                                        type: "bool",
                                        id: 6,
                                        options: {
                                            deprecated: !0
                                        }
                                    },
                                    features: {
                                        type: "FeatureSet",
                                        id: 7
                                    },
                                    uninterpretedOption: {
                                        rule: "repeated",
                                        type: "UninterpretedOption",
                                        id: 999
                                    }
                                },
                                extensions: [
                                    [1000, 536870911]
                                ],
                                reserved: [
                                    [5, 5]
                                ]
                            },
                            EnumValueOptions: {
                                edition: "proto2",
                                fields: {
                                    deprecated: {
                                        type: "bool",
                                        id: 1
                                    },
                                    features: {
                                        type: "FeatureSet",
                                        id: 2
                                    },
                                    debugRedact: {
                                        type: "bool",
                                        id: 3
                                    },
                                    featureSupport: {
                                        type: "FieldOptions.FeatureSupport",
                                        id: 4
                                    },
                                    uninterpretedOption: {
                                        rule: "repeated",
                                        type: "UninterpretedOption",
                                        id: 999
                                    }
                                },
                                extensions: [
                                    [1000, 536870911]
                                ]
                            },
                            ServiceOptions: {
                                edition: "proto2",
                                fields: {
                                    features: {
                                        type: "FeatureSet",
                                        id: 34
                                    },
                                    deprecated: {
                                        type: "bool",
                                        id: 33
                                    },
                                    uninterpretedOption: {
                                        rule: "repeated",
                                        type: "UninterpretedOption",
                                        id: 999
                                    }
                                },
                                extensions: [
                                    [1000, 536870911]
                                ]
                            },
                            MethodOptions: {
                                edition: "proto2",
                                fields: {
                                    deprecated: {
                                        type: "bool",
                                        id: 33
                                    },
                                    idempotencyLevel: {
                                        type: "IdempotencyLevel",
                                        id: 34,
                                        options: {
                                            default: "IDEMPOTENCY_UNKNOWN"
                                        }
                                    },
                                    features: {
                                        type: "FeatureSet",
                                        id: 35
                                    },
                                    uninterpretedOption: {
                                        rule: "repeated",
                                        type: "UninterpretedOption",
                                        id: 999
                                    }
                                },
                                extensions: [
                                    [1000, 536870911]
                                ],
                                nested: {
                                    IdempotencyLevel: {
                                        values: {
                                            IDEMPOTENCY_UNKNOWN: 0,
                                            NO_SIDE_EFFECTS: 1,
                                            IDEMPOTENT: 2
                                        }
                                    }
                                }
                            },
                            UninterpretedOption: {
                                edition: "proto2",
                                fields: {
                                    name: {
                                        rule: "repeated",
                                        type: "NamePart",
                                        id: 2
                                    },
                                    identifierValue: {
                                        type: "string",
                                        id: 3
                                    },
                                    positiveIntValue: {
                                        type: "uint64",
                                        id: 4
                                    },
                                    negativeIntValue: {
                                        type: "int64",
                                        id: 5
                                    },
                                    doubleValue: {
                                        type: "double",
                                        id: 6
                                    },
                                    stringValue: {
                                        type: "bytes",
                                        id: 7
                                    },
                                    aggregateValue: {
                                        type: "string",
                                        id: 8
                                    }
                                },
                                nested: {
                                    NamePart: {
                                        fields: {
                                            namePart: {
                                                rule: "required",
                                                type: "string",
                                                id: 1
                                            },
                                            isExtension: {
                                                rule: "required",
                                                type: "bool",
                                                id: 2
                                            }
                                        }
                                    }
                                }
                            },
                            FeatureSet: {
                                edition: "proto2",
                                fields: {
                                    fieldPresence: {
                                        type: "FieldPresence",
                                        id: 1,
                                        options: {
                                            retention: "RETENTION_RUNTIME",
                                            targets: "TARGET_TYPE_FILE",
                                            "feature_support.edition_introduced": "EDITION_2023",
                                            "edition_defaults.edition": "EDITION_2023",
                                            "edition_defaults.value": "EXPLICIT"
                                        }
                                    },
                                    enumType: {
                                        type: "EnumType",
                                        id: 2,
                                        options: {
                                            retention: "RETENTION_RUNTIME",
                                            targets: "TARGET_TYPE_FILE",
                                            "feature_support.edition_introduced": "EDITION_2023",
                                            "edition_defaults.edition": "EDITION_PROTO3",
                                            "edition_defaults.value": "OPEN"
                                        }
                                    },
                                    repeatedFieldEncoding: {
                                        type: "RepeatedFieldEncoding",
                                        id: 3,
                                        options: {
                                            retention: "RETENTION_RUNTIME",
                                            targets: "TARGET_TYPE_FILE",
                                            "feature_support.edition_introduced": "EDITION_2023",
                                            "edition_defaults.edition": "EDITION_PROTO3",
                                            "edition_defaults.value": "PACKED"
                                        }
                                    },
                                    utf8Validation: {
                                        type: "Utf8Validation",
                                        id: 4,
                                        options: {
                                            retention: "RETENTION_RUNTIME",
                                            targets: "TARGET_TYPE_FILE",
                                            "feature_support.edition_introduced": "EDITION_2023",
                                            "edition_defaults.edition": "EDITION_PROTO3",
                                            "edition_defaults.value": "VERIFY"
                                        }
                                    },
                                    messageEncoding: {
                                        type: "MessageEncoding",
                                        id: 5,
                                        options: {
                                            retention: "RETENTION_RUNTIME",
                                            targets: "TARGET_TYPE_FILE",
                                            "feature_support.edition_introduced": "EDITION_2023",
                                            "edition_defaults.edition": "EDITION_LEGACY",
                                            "edition_defaults.value": "LENGTH_PREFIXED"
                                        }
                                    },
                                    jsonFormat: {
                                        type: "JsonFormat",
                                        id: 6,
                                        options: {
                                            retention: "RETENTION_RUNTIME",
                                            targets: "TARGET_TYPE_FILE",
                                            "feature_support.edition_introduced": "EDITION_2023",
                                            "edition_defaults.edition": "EDITION_PROTO3",
                                            "edition_defaults.value": "ALLOW"
                                        }
                                    },
                                    enforceNamingStyle: {
                                        type: "EnforceNamingStyle",
                                        id: 7,
                                        options: {
                                            retention: "RETENTION_SOURCE",
                                            targets: "TARGET_TYPE_METHOD",
                                            "feature_support.edition_introduced": "EDITION_2024",
                                            "edition_defaults.edition": "EDITION_2024",
                                            "edition_defaults.value": "STYLE2024"
                                        }
                                    },
                                    defaultSymbolVisibility: {
                                        type: "VisibilityFeature.DefaultSymbolVisibility",
                                        id: 8,
                                        options: {
                                            retention: "RETENTION_SOURCE",
                                            targets: "TARGET_TYPE_FILE",
                                            "feature_support.edition_introduced": "EDITION_2024",
                                            "edition_defaults.edition": "EDITION_2024",
                                            "edition_defaults.value": "EXPORT_TOP_LEVEL"
                                        }
                                    }
                                },
                                extensions: [
                                    [1000, 9994],
                                    [9995, 9999],
                                    [1e4, 1e4]
                                ],
                                reserved: [
                                    [999, 999]
                                ],
                                nested: {
                                    FieldPresence: {
                                        values: {
                                            FIELD_PRESENCE_UNKNOWN: 0,
                                            EXPLICIT: 1,
                                            IMPLICIT: 2,
                                            LEGACY_REQUIRED: 3
                                        }
                                    },
                                    EnumType: {
                                        values: {
                                            ENUM_TYPE_UNKNOWN: 0,
                                            OPEN: 1,
                                            CLOSED: 2
                                        }
                                    },
                                    RepeatedFieldEncoding: {
                                        values: {
                                            REPEATED_FIELD_ENCODING_UNKNOWN: 0,
                                            PACKED: 1,
                                            EXPANDED: 2
                                        }
                                    },
                                    Utf8Validation: {
                                        values: {
                                            UTF8_VALIDATION_UNKNOWN: 0,
                                            VERIFY: 2,
                                            NONE: 3
                                        }
                                    },
                                    MessageEncoding: {
                                        values: {
                                            MESSAGE_ENCODING_UNKNOWN: 0,
                                            LENGTH_PREFIXED: 1,
                                            DELIMITED: 2
                                        }
                                    },
                                    JsonFormat: {
                                        values: {
                                            JSON_FORMAT_UNKNOWN: 0,
                                            ALLOW: 1,
                                            LEGACY_BEST_EFFORT: 2
                                        }
                                    },
                                    EnforceNamingStyle: {
                                        values: {
                                            ENFORCE_NAMING_STYLE_UNKNOWN: 0,
                                            STYLE2024: 1,
                                            STYLE_LEGACY: 2
                                        }
                                    },
                                    VisibilityFeature: {
                                        fields: {},
                                        reserved: [
                                            [1, 536870911]
                                        ],
                                        nested: {
                                            DefaultSymbolVisibility: {
                                                values: {
                                                    DEFAULT_SYMBOL_VISIBILITY_UNKNOWN: 0,
                                                    EXPORT_ALL: 1,
                                                    EXPORT_TOP_LEVEL: 2,
                                                    LOCAL_ALL: 3,
                                                    STRICT: 4
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            FeatureSetDefaults: {
                                edition: "proto2",
                                fields: {
                                    defaults: {
                                        rule: "repeated",
                                        type: "FeatureSetEditionDefault",
                                        id: 1
                                    },
                                    minimumEdition: {
                                        type: "Edition",
                                        id: 4
                                    },
                                    maximumEdition: {
                                        type: "Edition",
                                        id: 5
                                    }
                                },
                                nested: {
                                    FeatureSetEditionDefault: {
                                        fields: {
                                            edition: {
                                                type: "Edition",
                                                id: 3
                                            },
                                            overridableFeatures: {
                                                type: "FeatureSet",
                                                id: 4
                                            },
                                            fixedFeatures: {
                                                type: "FeatureSet",
                                                id: 5
                                            }
                                        },
                                        reserved: [
                                            [1, 1],
                                            [2, 2], "features"
                                        ]
                                    }
                                }
                            },
                            SourceCodeInfo: {
                                edition: "proto2",
                                fields: {
                                    location: {
                                        rule: "repeated",
                                        type: "Location",
                                        id: 1
                                    }
                                },
                                extensions: [
                                    [536000000, 536000000]
                                ],
                                nested: {
                                    Location: {
                                        fields: {
                                            path: {
                                                rule: "repeated",
                                                type: "int32",
                                                id: 1,
                                                options: {
                                                    packed: !0
                                                }
                                            },
                                            span: {
                                                rule: "repeated",
                                                type: "int32",
                                                id: 2,
                                                options: {
                                                    packed: !0
                                                }
                                            },
                                            leadingComments: {
                                                type: "string",
                                                id: 3
                                            },
                                            trailingComments: {
                                                type: "string",
                                                id: 4
                                            },
                                            leadingDetachedComments: {
                                                rule: "repeated",
                                                type: "string",
                                                id: 6
                                            }
                                        }
                                    }
                                }
                            },
                            GeneratedCodeInfo: {
                                edition: "proto2",
                                fields: {
                                    annotation: {
                                        rule: "repeated",
                                        type: "Annotation",
                                        id: 1
                                    }
                                },
                                nested: {
                                    Annotation: {
                                        fields: {
                                            path: {
                                                rule: "repeated",
                                                type: "int32",
                                                id: 1,
                                                options: {
                                                    packed: !0
                                                }
                                            },
                                            sourceFile: {
                                                type: "string",
                                                id: 2
                                            },
                                            begin: {
                                                type: "int32",
                                                id: 3
                                            },
                                            end: {
                                                type: "int32",
                                                id: 4
                                            },
                                            semantic: {
                                                type: "Semantic",
                                                id: 5
                                            }
                                        },
                                        nested: {
                                            Semantic: {
                                                values: {
                                                    NONE: 0,
                                                    SET: 1,
                                                    ALIAS: 2
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            SymbolVisibility: {
                                edition: "proto2",
                                values: {
                                    VISIBILITY_UNSET: 0,
                                    VISIBILITY_LOCAL: 1,
                                    VISIBILITY_EXPORT: 2
                                }
                            }
                        }
                    }
                }
            }
        }
    }
})
// @from(Ln 309932, Col 4)
Sm4 = x((b3, hm4) => {
    var zE = ZT1();
    hm4.exports = b3 = zE.descriptor = zE.Root.fromJSON(BC8()).lookup(".google.protobuf");
    var {
        Namespace: km4,
        Root: Dd6,
        Enum: ic,
        Type: Lg,
        Field: oe,
        MapField: EjY,
        OneOf: GT1,
        Service: Xd6,
        Method: fT1
    } = zE;
    Dd6.fromDescriptor = function(q) {
        if (typeof q.length === "number") q = b3.FileDescriptorSet.decode(q);
        var K = new Dd6;
        if (q.file) {
            var Y, z;
            for (var _ = 0, w; _ < q.file.length; ++_) {
                if (z = K, (Y = q.file[_]).package && Y.package.length) z = K.define(Y.package);
                var O = ujY(Y);
                if (Y.name && Y.name.length) K.files.push(z.filename = Y.name);
                if (Y.messageType)
                    for (w = 0; w < Y.messageType.length; ++w) z.add(Lg.fromDescriptor(Y.messageType[w], O));
                if (Y.enumType)
                    for (w = 0; w < Y.enumType.length; ++w) z.add(ic.fromDescriptor(Y.enumType[w], O));
                if (Y.extension)
                    for (w = 0; w < Y.extension.length; ++w) z.add(oe.fromDescriptor(Y.extension[w], O));
                if (Y.service)
                    for (w = 0; w < Y.service.length; ++w) z.add(Xd6.fromDescriptor(Y.service[w], O));
                var $ = BG6(Y.options, b3.FileOptions);
                if ($) {
                    var H = Object.keys($);
                    for (w = 0; w < H.length; ++w) z.setOption(H[w], $[H[w]])
                }
            }
        }
        return K.resolveAll()
    };
    Dd6.prototype.toDescriptor = function(q) {
        var K = b3.FileDescriptorSet.create();
        return Em4(this, K.file, q), K
    };

    function Em4(A, q, K) {
        var Y = b3.FileDescriptorProto.create({
            name: A.filename || (A.fullName.substring(1).replace(/\./g, "_") || "root") + ".proto"
        });
        if (mjY(K, Y), !(A instanceof Dd6)) Y.package = A.fullName.substring(1);
        for (var z = 0, _; z < A.nestedArray.length; ++z)
            if ((_ = A._nestedArray[z]) instanceof Lg) Y.messageType.push(_.toDescriptor(K));
            else if (_ instanceof ic) Y.enumType.push(_.toDescriptor());
        else if (_ instanceof oe) Y.extension.push(_.toDescriptor(K));
        else if (_ instanceof Xd6) Y.service.push(_.toDescriptor());
        else if (_ instanceof km4) Em4(_, q, K);
        if (Y.options = gG6(A.options, b3.FileOptions), Y.messageType.length + Y.enumType.length + Y.extension.length + Y.service.length) q.push(Y)
    }
    var yjY = 0;
    Lg.fromDescriptor = function(q, K, Y) {
        if (typeof q.length === "number") q = b3.DescriptorProto.decode(q);
        var z = new Lg(q.name.length ? q.name : "Type" + yjY++, BG6(q.options, b3.MessageOptions)),
            _;
        if (!Y) z._edition = K;
        if (q.oneofDecl)
            for (_ = 0; _ < q.oneofDecl.length; ++_) z.add(GT1.fromDescriptor(q.oneofDecl[_]));
        if (q.field)
            for (_ = 0; _ < q.field.length; ++_) {
                var w = oe.fromDescriptor(q.field[_], K, !0);
                if (z.add(w), q.field[_].hasOwnProperty("oneofIndex")) z.oneofsArray[q.field[_].oneofIndex].add(w)
            }
        if (q.extension)
            for (_ = 0; _ < q.extension.length; ++_) z.add(oe.fromDescriptor(q.extension[_], K, !0));
        if (q.nestedType) {
            for (_ = 0; _ < q.nestedType.length; ++_)
                if (z.add(Lg.fromDescriptor(q.nestedType[_], K, !0)), q.nestedType[_].options && q.nestedType[_].options.mapEntry) z.setOption("map_entry", !0)
        }
        if (q.enumType)
            for (_ = 0; _ < q.enumType.length; ++_) z.add(ic.fromDescriptor(q.enumType[_], K, !0));
        if (q.extensionRange && q.extensionRange.length) {
            z.extensions = [];
            for (_ = 0; _ < q.extensionRange.length; ++_) z.extensions.push([q.extensionRange[_].start, q.extensionRange[_].end])
        }
        if (q.reservedRange && q.reservedRange.length || q.reservedName && q.reservedName.length) {
            if (z.reserved = [], q.reservedRange)
                for (_ = 0; _ < q.reservedRange.length; ++_) z.reserved.push([q.reservedRange[_].start, q.reservedRange[_].end]);
            if (q.reservedName)
                for (_ = 0; _ < q.reservedName.length; ++_) z.reserved.push(q.reservedName[_])
        }
        return z
    };
    Lg.prototype.toDescriptor = function(q) {
        var K = b3.DescriptorProto.create({
                name: this.name
            }),
            Y;
        for (Y = 0; Y < this.fieldsArray.length; ++Y) {
            var z;
            if (K.field.push(z = this._fieldsArray[Y].toDescriptor(q)), this._fieldsArray[Y] instanceof EjY) {
                var _ = gC8(this._fieldsArray[Y].keyType, this._fieldsArray[Y].resolvedKeyType, !1),
                    w = gC8(this._fieldsArray[Y].type, this._fieldsArray[Y].resolvedType, !1),
                    O = w === 11 || w === 14 ? this._fieldsArray[Y].resolvedType && Rm4(this.parent, this._fieldsArray[Y].resolvedType) || this._fieldsArray[Y].type : void 0;
                K.nestedType.push(b3.DescriptorProto.create({
                    name: z.typeName,
                    field: [b3.FieldDescriptorProto.create({
                        name: "key",
                        number: 1,
                        label: 1,
                        type: _
                    }), b3.FieldDescriptorProto.create({
                        name: "value",
                        number: 2,
                        label: 1,
                        type: w,
                        typeName: O
                    })],
                    options: b3.MessageOptions.create({
                        mapEntry: !0
                    })
                }))
            }
        }
        for (Y = 0; Y < this.oneofsArray.length; ++Y) K.oneofDecl.push(this._oneofsArray[Y].toDescriptor());
        for (Y = 0; Y < this.nestedArray.length; ++Y)
            if (this._nestedArray[Y] instanceof oe) K.field.push(this._nestedArray[Y].toDescriptor(q));
            else if (this._nestedArray[Y] instanceof Lg) K.nestedType.push(this._nestedArray[Y].toDescriptor(q));
        else if (this._nestedArray[Y] instanceof ic) K.enumType.push(this._nestedArray[Y].toDescriptor());
        if (this.extensions)
            for (Y = 0; Y < this.extensions.length; ++Y) K.extensionRange.push(b3.DescriptorProto.ExtensionRange.create({
                start: this.extensions[Y][0],
                end: this.extensions[Y][1]
            }));
        if (this.reserved)
            for (Y = 0; Y < this.reserved.length; ++Y)
                if (typeof this.reserved[Y] === "string") K.reservedName.push(this.reserved[Y]);
                else K.reservedRange.push(b3.DescriptorProto.ReservedRange.create({
                    start: this.reserved[Y][0],
                    end: this.reserved[Y][1]
                }));
        return K.options = gG6(this.options, b3.MessageOptions), K
    };
    var LjY = /^(?![eE])[0-9]*(?:\.[0-9]*)?(?:[eE][+-]?[0-9]+)?$/;
    oe.fromDescriptor = function(q, K, Y) {
        if (typeof q.length === "number") q = b3.DescriptorProto.decode(q);
        if (typeof q.number !== "number") throw Error("missing field id");
        var z;
        if (q.typeName && q.typeName.length) z = q.typeName;
        else z = IjY(q.type);
        var _;
        switch (q.label) {
            case 1:
                _ = void 0;
                break;
            case 2:
                _ = "required";
                break;
            case 3:
                _ = "repeated";
                break;
            default:
                throw Error("illegal label: " + q.label)
        }
        var w = q.extendee;
        if (q.extendee !== void 0) w = w.length ? w : void 0;
        var O = new oe(q.name.length ? q.name : "field" + q.number, q.number, z, _, w);
        if (!Y) O._edition = K;
        if (O.options = BG6(q.options, b3.FieldOptions), q.proto3_optional) O.options.proto3_optional = !0;
        if (q.defaultValue && q.defaultValue.length) {
            var $ = q.defaultValue;
            switch ($) {
                case "true":
                case "TRUE":
                    $ = !0;
                    break;
                case "false":
                case "FALSE":
                    $ = !1;
                    break;
                default:
                    var H = LjY.exec($);
                    if (H) $ = parseInt($);
                    break
            }
            O.setOption("default", $)
        }
        if (bjY(q.type)) {
            if (K === "proto3") {
                if (q.options && !q.options.packed) O.setOption("packed", !1)
            } else if ((!K || K === "proto2") && q.options && q.options.packed) O.setOption("packed", !0)
        }
        return O
    };
    oe.prototype.toDescriptor = function(q) {
        var K = b3.FieldDescriptorProto.create({
            name: this.name,
            number: this.id
        });
        if (this.map) K.type = 11, K.typeName = zE.util.ucFirst(this.name), K.label = 3;
        else {
            switch (K.type = gC8(this.type, this.resolve().resolvedType, this.delimited)) {
                case 10:
                case 11:
                case 14:
                    K.typeName = this.resolvedType ? Rm4(this.parent, this.resolvedType) : this.type;
                    break
            }
            if (this.rule === "repeated") K.label = 3;
            else if (this.required && q === "proto2") K.label = 2;
            else K.label = 1
        }
        if (K.extendee = this.extensionField ? this.extensionField.parent.fullName : this.extend, this.partOf) {
            if ((K.oneofIndex = this.parent.oneofsArray.indexOf(this.partOf)) < 0) throw Error("missing oneof")
        }
        if (this.options) {
            if (K.options = gG6(this.options, b3.FieldOptions), this.options.default != null) K.defaultValue = String(this.options.default);
            if (this.options.proto3_optional) K.proto3_optional = !0
        }
        if (q === "proto3") {
            if (!this.packed)(K.options || (K.options = b3.FieldOptions.create())).packed = !1
        } else if ((!q || q === "proto2") && this.packed)(K.options || (K.options = b3.FieldOptions.create())).packed = !0;
        return K
    };
    var RjY = 0;
    ic.fromDescriptor = function(q, K, Y) {
        if (typeof q.length === "number") q = b3.EnumDescriptorProto.decode(q);
        var z = {};
        if (q.value)
            for (var _ = 0; _ < q.value.length; ++_) {
                var w = q.value[_].name,
                    O = q.value[_].number || 0;
                z[w && w.length ? w : "NAME" + O] = O
            }
        var $ = new ic(q.name && q.name.length ? q.name : "Enum" + RjY++, z, BG6(q.options, b3.EnumOptions));
        if (!Y) $._edition = K;
        return $
    };
    ic.prototype.toDescriptor = function() {
        var q = [];
        for (var K = 0, Y = Object.keys(this.values); K < Y.length; ++K) q.push(b3.EnumValueDescriptorProto.create({
            name: Y[K],
            number: this.values[Y[K]]
        }));
        return b3.EnumDescriptorProto.create({
            name: this.name,
            value: q,
            options: gG6(this.options, b3.EnumOptions)
        })
    };
    var hjY = 0;
    GT1.fromDescriptor = function(q) {
        if (typeof q.length === "number") q = b3.OneofDescriptorProto.decode(q);
        return new GT1(q.name && q.name.length ? q.name : "oneof" + hjY++)
    };
    GT1.prototype.toDescriptor = function() {
        return b3.OneofDescriptorProto.create({
            name: this.name
        })
    };
    var SjY = 0;
    Xd6.fromDescriptor = function(q, K, Y) {
        if (typeof q.length === "number") q = b3.ServiceDescriptorProto.decode(q);
        var z = new Xd6(q.name && q.name.length ? q.name : "Service" + SjY++, BG6(q.options, b3.ServiceOptions));
        if (!Y) z._edition = K;
        if (q.method)
            for (var _ = 0; _ < q.method.length; ++_) z.add(fT1.fromDescriptor(q.method[_]));
        return z
    };
    Xd6.prototype.toDescriptor = function() {
        var q = [];
        for (var K = 0; K < this.methodsArray.length; ++K) q.push(this._methodsArray[K].toDescriptor());
        return b3.ServiceDescriptorProto.create({
            name: this.name,
            method: q,
            options: gG6(this.options, b3.ServiceOptions)
        })
    };
    var CjY = 0;
    fT1.fromDescriptor = function(q) {
        if (typeof q.length === "number") q = b3.MethodDescriptorProto.decode(q);
        return new fT1(q.name && q.name.length ? q.name : "Method" + CjY++, "rpc", q.inputType, q.outputType, Boolean(q.clientStreaming), Boolean(q.serverStreaming), BG6(q.options, b3.MethodOptions))
    };
    fT1.prototype.toDescriptor = function() {
        return b3.MethodDescriptorProto.create({
            name: this.name,
            inputType: this.resolvedRequestType ? this.resolvedRequestType.fullName : this.requestType,
            outputType: this.resolvedResponseType ? this.resolvedResponseType.fullName : this.responseType,
            clientStreaming: this.requestStream,
            serverStreaming: this.responseStream,
            options: gG6(this.options, b3.MethodOptions)
        })
    };

    function IjY(A) {
        switch (A) {
            case 1:
                return "double";
            case 2:
                return "float";
            case 3:
                return "int64";
            case 4:
                return "uint64";
            case 5:
                return "int32";
            case 6:
                return "fixed64";
            case 7:
                return "fixed32";
            case 8:
                return "bool";
            case 9:
                return "string";
            case 12:
                return "bytes";
            case 13:
                return "uint32";
            case 15:
                return "sfixed32";
            case 16:
                return "sfixed64";
            case 17:
                return "sint32";
            case 18:
                return "sint64"
        }
        throw Error("illegal type: " + A)
    }

    function bjY(A) {
        switch (A) {
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
            case 8:
            case 13:
            case 14:
            case 15:
            case 16:
            case 17:
            case 18:
                return !0
        }
        return !1
    }

    function gC8(A, q, K) {
        switch (A) {
            case "double":
                return 1;
            case "float":
                return 2;
            case "int64":
                return 3;
            case "uint64":
                return 4;
            case "int32":
                return 5;
            case "fixed64":
                return 6;
            case "fixed32":
                return 7;
            case "bool":
                return 8;
            case "string":
                return 9;
            case "bytes":
                return 12;
            case "uint32":
                return 13;
            case "sfixed32":
                return 15;
            case "sfixed64":
                return 16;
            case "sint32":
                return 17;
            case "sint64":
                return 18
        }
        if (q instanceof ic) return 14;
        if (q instanceof Lg) return K ? 10 : 11;
        throw Error("illegal type: " + A)
    }

    function ym4(A, q) {
        var K = {};
        for (var Y = 0, z, _; Y < q.fieldsArray.length; ++Y) {
            if ((_ = (z = q._fieldsArray[Y]).name) === "uninterpretedOption") continue;
            if (!Object.prototype.hasOwnProperty.call(A, _)) continue;
            var w = xjY(_);
            if (z.resolvedType instanceof Lg) K[w] = ym4(A[_], z.resolvedType);
            else if (z.resolvedType instanceof ic) K[w] = z.resolvedType.valuesById[A[_]];
            else K[w] = A[_]
        }
        return K
    }

    function BG6(A, q) {
        if (!A) return;
        return ym4(q.toObject(A), q)
    }

    function Lm4(A, q) {
        var K = {},
            Y = Object.keys(A);
        for (var z = 0; z < Y.length; ++z) {
            var _ = Y[z],
                w = zE.util.camelCase(_);
            if (!Object.prototype.hasOwnProperty.call(q.fields, w)) continue;
            var O = q.fields[w];
            if (O.resolvedType instanceof Lg) K[w] = Lm4(A[_], O.resolvedType);
            else K[w] = A[_];
            if (O.repeated && !Array.isArray(K[w])) K[w] = [K[w]]
        }
        return K
    }

    function gG6(A, q) {
        if (!A) return;
        return q.fromObject(Lm4(A, q))
    }

    function Rm4(A, q) {
        var K = A.fullName.split("."),
            Y = q.fullName.split("."),
            z = 0,
            _ = 0,
            w = Y.length - 1;
        if (!(A instanceof Dd6) && q instanceof km4)
            while (z < K.length && _ < w && K[z] === Y[_]) {
                var O = q.lookup(K[z++], !0);
                if (O !== null && O !== q) break;
                ++_
            } else
                for (; z < K.length && _ < w && K[z] === Y[_]; ++z, ++_);
        return Y.slice(_).join(".")
    }

    function xjY(A) {
        return A.substring(0, 1) + A.substring(1).replace(/([A-Z])(?=[a-z]|$)/g, function(q, K) {
            return "_" + K.toLowerCase()
        })
    }

    function ujY(A) {
        if (A.syntax === "editions") switch (A.edition) {
            case b3.Edition.EDITION_2023:
                return "2023";
            default:
                throw Error("Unsupported edition " + A.edition)
        }
        if (A.syntax === "proto3") return "proto3";
        return "proto2"
    }

    function mjY(A, q) {
        if (!A) return;
        if (A === "proto2" || A === "proto3") q.syntax = A;
        else switch (q.syntax = "editions", A) {
            case "2023":
                q.edition = b3.Edition.EDITION_2023;
                break;
            default:
                throw Error("Unsupported edition " + A)
        }
    }
})
// @from(Ln 310402, Col 4)
Cm4 = x((SWw, BjY) => {
    BjY.exports = {
        nested: {
            google: {
                nested: {
                    protobuf: {
                        nested: {
                            Api: {
                                fields: {
                                    name: {
                                        type: "string",
                                        id: 1
                                    },
                                    methods: {
                                        rule: "repeated",
                                        type: "Method",
                                        id: 2
                                    },
                                    options: {
                                        rule: "repeated",
                                        type: "Option",
                                        id: 3
                                    },
                                    version: {
                                        type: "string",
                                        id: 4
                                    },
                                    sourceContext: {
                                        type: "SourceContext",
                                        id: 5
                                    },
                                    mixins: {
                                        rule: "repeated",
                                        type: "Mixin",
                                        id: 6
                                    },
                                    syntax: {
                                        type: "Syntax",
                                        id: 7
                                    }
                                }
                            },
                            Method: {
                                fields: {
                                    name: {
                                        type: "string",
                                        id: 1
                                    },
                                    requestTypeUrl: {
                                        type: "string",
                                        id: 2
                                    },
                                    requestStreaming: {
                                        type: "bool",
                                        id: 3
                                    },
                                    responseTypeUrl: {
                                        type: "string",
                                        id: 4
                                    },
                                    responseStreaming: {
                                        type: "bool",
                                        id: 5
                                    },
                                    options: {
                                        rule: "repeated",
                                        type: "Option",
                                        id: 6
                                    },
                                    syntax: {
                                        type: "Syntax",
                                        id: 7
                                    }
                                }
                            },
                            Mixin: {
                                fields: {
                                    name: {
                                        type: "string",
                                        id: 1
                                    },
                                    root: {
                                        type: "string",
                                        id: 2
                                    }
                                }
                            },
                            SourceContext: {
                                fields: {
                                    fileName: {
                                        type: "string",
                                        id: 1
                                    }
                                }
                            },
                            Option: {
                                fields: {
                                    name: {
                                        type: "string",
                                        id: 1
                                    },
                                    value: {
                                        type: "Any",
                                        id: 2
                                    }
                                }
                            },
                            Syntax: {
                                values: {
                                    SYNTAX_PROTO2: 0,
                                    SYNTAX_PROTO3: 1
                                }
                            }
                        }
                    }
                }
            }
        }
    }
})
// @from(Ln 310522, Col 4)
Im4 = x((CWw, gjY) => {
    gjY.exports = {
        nested: {
            google: {
                nested: {
                    protobuf: {
                        nested: {
                            SourceContext: {
                                fields: {
                                    fileName: {
                                        type: "string",
                                        id: 1
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
})
// @from(Ln 310544, Col 4)
bm4 = x((IWw, FjY) => {
    FjY.exports = {
        nested: {
            google: {
                nested: {
                    protobuf: {
                        nested: {
                            Type: {
                                fields: {
                                    name: {
                                        type: "string",
                                        id: 1
                                    },
                                    fields: {
                                        rule: "repeated",
                                        type: "Field",
                                        id: 2
                                    },
                                    oneofs: {
                                        rule: "repeated",
                                        type: "string",
                                        id: 3
                                    },
                                    options: {
                                        rule: "repeated",
                                        type: "Option",
                                        id: 4
                                    },
                                    sourceContext: {
                                        type: "SourceContext",
                                        id: 5
                                    },
                                    syntax: {
                                        type: "Syntax",
                                        id: 6
                                    }
                                }
                            },
                            Field: {
                                fields: {
                                    kind: {
                                        type: "Kind",
                                        id: 1
                                    },
                                    cardinality: {
                                        type: "Cardinality",
                                        id: 2
                                    },
                                    number: {
                                        type: "int32",
                                        id: 3
                                    },
                                    name: {
                                        type: "string",
                                        id: 4
                                    },
                                    typeUrl: {
                                        type: "string",
                                        id: 6
                                    },
                                    oneofIndex: {
                                        type: "int32",
                                        id: 7
                                    },
                                    packed: {
                                        type: "bool",
                                        id: 8
                                    },
                                    options: {
                                        rule: "repeated",
                                        type: "Option",
                                        id: 9
                                    },
                                    jsonName: {
                                        type: "string",
                                        id: 10
                                    },
                                    defaultValue: {
                                        type: "string",
                                        id: 11
                                    }
                                },
                                nested: {
                                    Kind: {
                                        values: {
                                            TYPE_UNKNOWN: 0,
                                            TYPE_DOUBLE: 1,
                                            TYPE_FLOAT: 2,
                                            TYPE_INT64: 3,
                                            TYPE_UINT64: 4,
                                            TYPE_INT32: 5,
                                            TYPE_FIXED64: 6,
                                            TYPE_FIXED32: 7,
                                            TYPE_BOOL: 8,
                                            TYPE_STRING: 9,
                                            TYPE_GROUP: 10,
                                            TYPE_MESSAGE: 11,
                                            TYPE_BYTES: 12,
                                            TYPE_UINT32: 13,
                                            TYPE_ENUM: 14,
                                            TYPE_SFIXED32: 15,
                                            TYPE_SFIXED64: 16,
                                            TYPE_SINT32: 17,
                                            TYPE_SINT64: 18
                                        }
                                    },
                                    Cardinality: {
                                        values: {
                                            CARDINALITY_UNKNOWN: 0,
                                            CARDINALITY_OPTIONAL: 1,
                                            CARDINALITY_REQUIRED: 2,
                                            CARDINALITY_REPEATED: 3
                                        }
                                    }
                                }
                            },
                            Enum: {
                                fields: {
                                    name: {
                                        type: "string",
                                        id: 1
                                    },
                                    enumvalue: {
                                        rule: "repeated",
                                        type: "EnumValue",
                                        id: 2
                                    },
                                    options: {
                                        rule: "repeated",
                                        type: "Option",
                                        id: 3
                                    },
                                    sourceContext: {
                                        type: "SourceContext",
                                        id: 4
                                    },
                                    syntax: {
                                        type: "Syntax",
                                        id: 5
                                    }
                                }
                            },
                            EnumValue: {
                                fields: {
                                    name: {
                                        type: "string",
                                        id: 1
                                    },
                                    number: {
                                        type: "int32",
                                        id: 2
                                    },
                                    options: {
                                        rule: "repeated",
                                        type: "Option",
                                        id: 3
                                    }
                                }
                            },
                            Option: {
                                fields: {
                                    name: {
                                        type: "string",
                                        id: 1
                                    },
                                    value: {
                                        type: "Any",
                                        id: 2
                                    }
                                }
                            },
                            Syntax: {
                                values: {
                                    SYNTAX_PROTO2: 0,
                                    SYNTAX_PROTO3: 1
                                }
                            },
                            Any: {
                                fields: {
                                    type_url: {
                                        type: "string",
                                        id: 1
                                    },
                                    value: {
                                        type: "bytes",
                                        id: 2
                                    }
                                }
                            },
                            SourceContext: {
                                fields: {
                                    fileName: {
                                        type: "string",
                                        id: 1
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
})
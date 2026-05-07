
// @from(Ln 313006, Col 4)
Ge1 = p((v32, IFz) => {
    IFz.exports = {
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
// @from(Ln 314301, Col 4)
M7K = p((U_, X7K) => {
    var _S = PB8();
    X7K.exports = U_ = _S.descriptor = _S.Root.fromJSON(Ge1()).lookup(".google.protobuf");
    var {
        Namespace: w7K,
        Root: $q8,
        Enum: Gt,
        Type: Wl,
        Field: b36,
        MapField: xFz,
        OneOf: WB8,
        Service: jq8,
        Method: DB8
    } = _S;
    $q8.fromDescriptor = function(K) {
        if (typeof K.length === "number") K = U_.FileDescriptorSet.decode(K);
        var _ = new $q8;
        if (K.file) {
            var z, Y;
            for (var A = 0, O; A < K.file.length; ++A) {
                if (Y = _, (z = K.file[A]).package && z.package.length) Y = _.define(z.package);
                var w = cFz(z);
                if (z.name && z.name.length) _.files.push(Y.filename = z.name);
                if (z.messageType)
                    for (O = 0; O < z.messageType.length; ++O) Y.add(Wl.fromDescriptor(z.messageType[O], w));
                if (z.enumType)
                    for (O = 0; O < z.enumType.length; ++O) Y.add(Gt.fromDescriptor(z.enumType[O], w));
                if (z.extension)
                    for (O = 0; O < z.extension.length; ++O) Y.add(b36.fromDescriptor(z.extension[O], w));
                if (z.service)
                    for (O = 0; O < z.service.length; ++O) Y.add(jq8.fromDescriptor(z.service[O], w));
                var $ = yS6(z.options, U_.FileOptions);
                if ($) {
                    var j = Object.keys($);
                    for (O = 0; O < j.length; ++O) Y.setOption(j[O], $[j[O]])
                }
            }
        }
        return _.resolveAll()
    };
    $q8.prototype.toDescriptor = function(K) {
        var _ = U_.FileDescriptorSet.create();
        return $7K(this, _.file, K), _
    };

    function $7K(q, K, _) {
        var z = U_.FileDescriptorProto.create({
            name: q.filename || (q.fullName.substring(1).replace(/\./g, "_") || "root") + ".proto"
        });
        if (lFz(_, z), !(q instanceof $q8)) z.package = q.fullName.substring(1);
        for (var Y = 0, A; Y < q.nestedArray.length; ++Y)
            if ((A = q._nestedArray[Y]) instanceof Wl) z.messageType.push(A.toDescriptor(_));
            else if (A instanceof Gt) z.enumType.push(A.toDescriptor());
        else if (A instanceof b36) z.extension.push(A.toDescriptor(_));
        else if (A instanceof jq8) z.service.push(A.toDescriptor());
        else if (A instanceof w7K) $7K(A, K, _);
        if (z.options = LS6(q.options, U_.FileOptions), z.messageType.length + z.enumType.length + z.extension.length + z.service.length) K.push(z)
    }
    var uFz = 0;
    Wl.fromDescriptor = function(K, _, z) {
        if (typeof K.length === "number") K = U_.DescriptorProto.decode(K);
        var Y = new Wl(K.name.length ? K.name : "Type" + uFz++, yS6(K.options, U_.MessageOptions)),
            A;
        if (!z) Y._edition = _;
        if (K.oneofDecl)
            for (A = 0; A < K.oneofDecl.length; ++A) Y.add(WB8.fromDescriptor(K.oneofDecl[A]));
        if (K.field)
            for (A = 0; A < K.field.length; ++A) {
                var O = b36.fromDescriptor(K.field[A], _, !0);
                if (Y.add(O), K.field[A].hasOwnProperty("oneofIndex")) Y.oneofsArray[K.field[A].oneofIndex].add(O)
            }
        if (K.extension)
            for (A = 0; A < K.extension.length; ++A) Y.add(b36.fromDescriptor(K.extension[A], _, !0));
        if (K.nestedType) {
            for (A = 0; A < K.nestedType.length; ++A)
                if (Y.add(Wl.fromDescriptor(K.nestedType[A], _, !0)), K.nestedType[A].options && K.nestedType[A].options.mapEntry) Y.setOption("map_entry", !0)
        }
        if (K.enumType)
            for (A = 0; A < K.enumType.length; ++A) Y.add(Gt.fromDescriptor(K.enumType[A], _, !0));
        if (K.extensionRange && K.extensionRange.length) {
            Y.extensions = [];
            for (A = 0; A < K.extensionRange.length; ++A) Y.extensions.push([K.extensionRange[A].start, K.extensionRange[A].end])
        }
        if (K.reservedRange && K.reservedRange.length || K.reservedName && K.reservedName.length) {
            if (Y.reserved = [], K.reservedRange)
                for (A = 0; A < K.reservedRange.length; ++A) Y.reserved.push([K.reservedRange[A].start, K.reservedRange[A].end]);
            if (K.reservedName)
                for (A = 0; A < K.reservedName.length; ++A) Y.reserved.push(K.reservedName[A])
        }
        return Y
    };
    Wl.prototype.toDescriptor = function(K) {
        var _ = U_.DescriptorProto.create({
                name: this.name
            }),
            z;
        for (z = 0; z < this.fieldsArray.length; ++z) {
            var Y;
            if (_.field.push(Y = this._fieldsArray[z].toDescriptor(K)), this._fieldsArray[z] instanceof xFz) {
                var A = ve1(this._fieldsArray[z].keyType, this._fieldsArray[z].resolvedKeyType, !1),
                    O = ve1(this._fieldsArray[z].type, this._fieldsArray[z].resolvedType, !1),
                    w = O === 11 || O === 14 ? this._fieldsArray[z].resolvedType && J7K(this.parent, this._fieldsArray[z].resolvedType) || this._fieldsArray[z].type : void 0;
                _.nestedType.push(U_.DescriptorProto.create({
                    name: Y.typeName,
                    field: [U_.FieldDescriptorProto.create({
                        name: "key",
                        number: 1,
                        label: 1,
                        type: A
                    }), U_.FieldDescriptorProto.create({
                        name: "value",
                        number: 2,
                        label: 1,
                        type: O,
                        typeName: w
                    })],
                    options: U_.MessageOptions.create({
                        mapEntry: !0
                    })
                }))
            }
        }
        for (z = 0; z < this.oneofsArray.length; ++z) _.oneofDecl.push(this._oneofsArray[z].toDescriptor());
        for (z = 0; z < this.nestedArray.length; ++z)
            if (this._nestedArray[z] instanceof b36) _.field.push(this._nestedArray[z].toDescriptor(K));
            else if (this._nestedArray[z] instanceof Wl) _.nestedType.push(this._nestedArray[z].toDescriptor(K));
        else if (this._nestedArray[z] instanceof Gt) _.enumType.push(this._nestedArray[z].toDescriptor());
        if (this.extensions)
            for (z = 0; z < this.extensions.length; ++z) _.extensionRange.push(U_.DescriptorProto.ExtensionRange.create({
                start: this.extensions[z][0],
                end: this.extensions[z][1]
            }));
        if (this.reserved)
            for (z = 0; z < this.reserved.length; ++z)
                if (typeof this.reserved[z] === "string") _.reservedName.push(this.reserved[z]);
                else _.reservedRange.push(U_.DescriptorProto.ReservedRange.create({
                    start: this.reserved[z][0],
                    end: this.reserved[z][1]
                }));
        return _.options = LS6(this.options, U_.MessageOptions), _
    };
    var mFz = /^(?![eE])[0-9]*(?:\.[0-9]*)?(?:[eE][+-]?[0-9]+)?$/;
    b36.fromDescriptor = function(K, _, z) {
        if (typeof K.length === "number") K = U_.DescriptorProto.decode(K);
        if (typeof K.number !== "number") throw Error("missing field id");
        var Y;
        if (K.typeName && K.typeName.length) Y = K.typeName;
        else Y = UFz(K.type);
        var A;
        switch (K.label) {
            case 1:
                A = void 0;
                break;
            case 2:
                A = "required";
                break;
            case 3:
                A = "repeated";
                break;
            default:
                throw Error("illegal label: " + K.label)
        }
        var O = K.extendee;
        if (K.extendee !== void 0) O = O.length ? O : void 0;
        var w = new b36(K.name.length ? K.name : "field" + K.number, K.number, Y, A, O);
        if (!z) w._edition = _;
        if (w.options = yS6(K.options, U_.FieldOptions), K.proto3_optional) w.options.proto3_optional = !0;
        if (K.defaultValue && K.defaultValue.length) {
            var $ = K.defaultValue;
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
                    var j = mFz.exec($);
                    if (j) $ = parseInt($);
                    break
            }
            w.setOption("default", $)
        }
        if (QFz(K.type)) {
            if (_ === "proto3") {
                if (K.options && !K.options.packed) w.setOption("packed", !1)
            } else if ((!_ || _ === "proto2") && K.options && K.options.packed) w.setOption("packed", !0)
        }
        return w
    };
    b36.prototype.toDescriptor = function(K) {
        var _ = U_.FieldDescriptorProto.create({
            name: this.name,
            number: this.id
        });
        if (this.map) _.type = 11, _.typeName = _S.util.ucFirst(this.name), _.label = 3;
        else {
            switch (_.type = ve1(this.type, this.resolve().resolvedType, this.delimited)) {
                case 10:
                case 11:
                case 14:
                    _.typeName = this.resolvedType ? J7K(this.parent, this.resolvedType) : this.type;
                    break
            }
            if (this.rule === "repeated") _.label = 3;
            else if (this.required && K === "proto2") _.label = 2;
            else _.label = 1
        }
        if (_.extendee = this.extensionField ? this.extensionField.parent.fullName : this.extend, this.partOf) {
            if ((_.oneofIndex = this.parent.oneofsArray.indexOf(this.partOf)) < 0) throw Error("missing oneof")
        }
        if (this.options) {
            if (_.options = LS6(this.options, U_.FieldOptions), this.options.default != null) _.defaultValue = String(this.options.default);
            if (this.options.proto3_optional) _.proto3_optional = !0
        }
        if (K === "proto3") {
            if (!this.packed)(_.options || (_.options = U_.FieldOptions.create())).packed = !1
        } else if ((!K || K === "proto2") && this.packed)(_.options || (_.options = U_.FieldOptions.create())).packed = !0;
        return _
    };
    var BFz = 0;
    Gt.fromDescriptor = function(K, _, z) {
        if (typeof K.length === "number") K = U_.EnumDescriptorProto.decode(K);
        var Y = {};
        if (K.value)
            for (var A = 0; A < K.value.length; ++A) {
                var O = K.value[A].name,
                    w = K.value[A].number || 0;
                Y[O && O.length ? O : "NAME" + w] = w
            }
        var $ = new Gt(K.name && K.name.length ? K.name : "Enum" + BFz++, Y, yS6(K.options, U_.EnumOptions));
        if (!z) $._edition = _;
        return $
    };
    Gt.prototype.toDescriptor = function() {
        var K = [];
        for (var _ = 0, z = Object.keys(this.values); _ < z.length; ++_) K.push(U_.EnumValueDescriptorProto.create({
            name: z[_],
            number: this.values[z[_]]
        }));
        return U_.EnumDescriptorProto.create({
            name: this.name,
            value: K,
            options: LS6(this.options, U_.EnumOptions)
        })
    };
    var pFz = 0;
    WB8.fromDescriptor = function(K) {
        if (typeof K.length === "number") K = U_.OneofDescriptorProto.decode(K);
        return new WB8(K.name && K.name.length ? K.name : "oneof" + pFz++)
    };
    WB8.prototype.toDescriptor = function() {
        return U_.OneofDescriptorProto.create({
            name: this.name
        })
    };
    var FFz = 0;
    jq8.fromDescriptor = function(K, _, z) {
        if (typeof K.length === "number") K = U_.ServiceDescriptorProto.decode(K);
        var Y = new jq8(K.name && K.name.length ? K.name : "Service" + FFz++, yS6(K.options, U_.ServiceOptions));
        if (!z) Y._edition = _;
        if (K.method)
            for (var A = 0; A < K.method.length; ++A) Y.add(DB8.fromDescriptor(K.method[A]));
        return Y
    };
    jq8.prototype.toDescriptor = function() {
        var K = [];
        for (var _ = 0; _ < this.methodsArray.length; ++_) K.push(this._methodsArray[_].toDescriptor());
        return U_.ServiceDescriptorProto.create({
            name: this.name,
            method: K,
            options: LS6(this.options, U_.ServiceOptions)
        })
    };
    var gFz = 0;
    DB8.fromDescriptor = function(K) {
        if (typeof K.length === "number") K = U_.MethodDescriptorProto.decode(K);
        return new DB8(K.name && K.name.length ? K.name : "Method" + gFz++, "rpc", K.inputType, K.outputType, Boolean(K.clientStreaming), Boolean(K.serverStreaming), yS6(K.options, U_.MethodOptions))
    };
    DB8.prototype.toDescriptor = function() {
        return U_.MethodDescriptorProto.create({
            name: this.name,
            inputType: this.resolvedRequestType ? this.resolvedRequestType.fullName : this.requestType,
            outputType: this.resolvedResponseType ? this.resolvedResponseType.fullName : this.responseType,
            clientStreaming: this.requestStream,
            serverStreaming: this.responseStream,
            options: LS6(this.options, U_.MethodOptions)
        })
    };

    function UFz(q) {
        switch (q) {
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
        throw Error("illegal type: " + q)
    }

    function QFz(q) {
        switch (q) {
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

    function ve1(q, K, _) {
        switch (q) {
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
        if (K instanceof Gt) return 14;
        if (K instanceof Wl) return _ ? 10 : 11;
        throw Error("illegal type: " + q)
    }

    function j7K(q, K) {
        var _ = {};
        for (var z = 0, Y, A; z < K.fieldsArray.length; ++z) {
            if ((A = (Y = K._fieldsArray[z]).name) === "uninterpretedOption") continue;
            if (!Object.prototype.hasOwnProperty.call(q, A)) continue;
            var O = dFz(A);
            if (Y.resolvedType instanceof Wl) _[O] = j7K(q[A], Y.resolvedType);
            else if (Y.resolvedType instanceof Gt) _[O] = Y.resolvedType.valuesById[q[A]];
            else _[O] = q[A]
        }
        return _
    }

    function yS6(q, K) {
        if (!q) return;
        return j7K(K.toObject(q), K)
    }

    function H7K(q, K) {
        var _ = {},
            z = Object.keys(q);
        for (var Y = 0; Y < z.length; ++Y) {
            var A = z[Y],
                O = _S.util.camelCase(A);
            if (!Object.prototype.hasOwnProperty.call(K.fields, O)) continue;
            var w = K.fields[O];
            if (w.resolvedType instanceof Wl) _[O] = H7K(q[A], w.resolvedType);
            else _[O] = q[A];
            if (w.repeated && !Array.isArray(_[O])) _[O] = [_[O]]
        }
        return _
    }

    function LS6(q, K) {
        if (!q) return;
        return K.fromObject(H7K(q, K))
    }

    function J7K(q, K) {
        var _ = q.fullName.split("."),
            z = K.fullName.split("."),
            Y = 0,
            A = 0,
            O = z.length - 1;
        if (!(q instanceof $q8) && K instanceof w7K)
            while (Y < _.length && A < O && _[Y] === z[A]) {
                var w = K.lookup(_[Y++], !0);
                if (w !== null && w !== K) break;
                ++A
            } else
                for (; Y < _.length && A < O && _[Y] === z[A]; ++Y, ++A);
        return z.slice(A).join(".")
    }

    function dFz(q) {
        return q.substring(0, 1) + q.substring(1).replace(/([A-Z])(?=[a-z]|$)/g, function(K, _) {
            return "_" + _.toLowerCase()
        })
    }

    function cFz(q) {
        if (q.syntax === "editions") switch (q.edition) {
            case U_.Edition.EDITION_2023:
                return "2023";
            default:
                throw Error("Unsupported edition " + q.edition)
        }
        if (q.syntax === "proto3") return "proto3";
        return "proto2"
    }

    function lFz(q, K) {
        if (!q) return;
        if (q === "proto2" || q === "proto3") K.syntax = q;
        else switch (K.syntax = "editions", q) {
            case "2023":
                K.edition = U_.Edition.EDITION_2023;
                break;
            default:
                throw Error("Unsupported edition " + q)
        }
    }
})
// @from(Ln 314771, Col 4)
P7K = p((T32, nFz) => {
    nFz.exports = {
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
// @from(Ln 314891, Col 4)
W7K = p((V32, iFz) => {
    iFz.exports = {
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
// @from(Ln 314913, Col 4)
D7K = p((k32, rFz) => {
    rFz.exports = {
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
export const communityGardenSchema = {
  type: 'object',
  title: 'Community Garden Overview',
  description:
    'Schema for a basic community garden page overview, suitable for dataset inclusion.',
  properties: {
    garden_id: {
      type: 'string',
      description: 'Unique identifier for the garden.',
    },
    garden_name: {
      type: 'string',
      description: 'Name of the community garden.',
    },
    status: {
      type: 'string',
      enum: ['Active', 'Planned', 'Seasonal Closure', 'Inactive'],
      description: 'Current operational status of the garden.',
    },
    description: {
      type: 'string',
      description: 'A brief overview and mission statement of the garden.',
    },
    address: {
      type: 'object',
      description: 'Physical address of the garden.',
      properties: {
        street_address: {
          type: 'string',
        },
        city: {
          type: 'string',
        },
        state_province: {
          type: 'string',
        },
        postal_code: {
          type: 'string',
        },
        country: {
          type: 'string',
        },
      },
      required: ['street_address', 'city', 'country'],
    },
    coordinates: {
      type: 'object',
      description: 'Geographic coordinates of the garden.',
      properties: {
        latitude: {
          type: 'number',
          format: 'float',
        },
        longitude: {
          type: 'number',
          format: 'float',
        },
      },
    },
    directions_landmarks: {
      type: 'string',
      description:
        'Helpful guidance for finding the garden (e.g., near park entrance, behind library).',
    },
    accessibility: {
      type: 'object',
      description: 'Information regarding accessibility features.',
      properties: {
        wheelchair_accessible: {
          type: 'boolean',
          description: 'Indicates if the garden is wheelchair accessible.',
        },
        accessible_features: {
          type: 'array',
          items: {
            type: 'string',
          },
          description:
            "Specific accessible features (e.g., 'raised beds', 'wide paths').",
        },
      },
    },
    public_transport_access: {
      type: 'array',
      items: {
        type: 'string',
      },
      description:
        "Nearby public transport options (e.g., 'bus stop line 10', 'train station Main Street').",
    },
    bike_access: {
      type: 'object',
      description: 'Information about bike access.',
      properties: {
        bike_racks_available: {
          type: 'boolean',
        },
      },
    },
    facilities: {
      type: 'object',
      description: 'Available facilities and amenities within the garden.',
      properties: {
        water_access: {
          type: 'object',
          properties: {
            available: { type: 'boolean' },
            type: {
              type: 'string',
              enum: [
                'shared spigots',
                'individual hoses',
                'rainwater harvesting',
                'unknown',
              ],
            },
            availability_hours: { type: 'string' },
          },
        },
        tool_storage: {
          type: 'object',
          properties: {
            available: { type: 'boolean' },
            shared_shed: { type: 'boolean' },
            tools_provided: { type: 'boolean' },
            tool_types: {
              type: 'array',
              items: { type: 'string' },
              description:
                "General types of tools provided (e.g., 'shovels', 'hoes', 'watering cans').",
            },
          },
        },
        restrooms: {
          type: 'object',
          properties: {
            available: { type: 'boolean' },
            type: {
              type: 'string',
              enum: ['compost toilet', 'plumbed', 'unknown'],
            },
            accessible: { type: 'boolean' },
          },
        },
        seating_areas: {
          type: 'object',
          properties: {
            available: { type: 'boolean' },
            type: {
              type: 'string',
              description: "e.g., 'benches', 'picnic tables'.",
            },
          },
        },
        shade_structures: {
          type: 'boolean',
        },
        compost_facilities: {
          type: 'object',
          properties: {
            available: { type: 'boolean' },
            type: {
              type: 'string',
              enum: ['communal piles', 'individual bins', 'unknown'],
            },
          },
        },
        waste_disposal: {
          type: 'object',
          properties: {
            general_waste_bins: { type: 'boolean' },
            recycling_bins: { type: 'boolean' },
          },
        },
        parking: {
          type: 'object',
          properties: {
            available: { type: 'boolean' },
            type: {
              type: 'string',
              enum: [
                'dedicated lot',
                'street parking',
                'nearby paid parking',
                'unknown',
              ],
            },
            capacity: {
              type: 'integer',
              description: 'Approximate number of parking spaces.',
            },
            accessible_parking: { type: 'boolean' },
          },
        },
      },
    },
    plot_information: {
      type: 'object',
      description: 'Details about garden plots.',
      properties: {
        number_of_plots: {
          type: 'integer',
          minimum: 0,
        },
        plot_sizes: {
          type: 'array',
          items: { type: 'string' },
          description: "Common plot sizes (e.g., '4x8 feet', 'various sizes').",
        },
        plot_type: {
          type: 'string',
          enum: [
            'individual plots',
            'communal growing areas',
            'mixed',
            'unknown',
          ],
        },
        waitlist: {
          type: 'object',
          properties: {
            available: { type: 'boolean' },
            estimated_wait_time: {
              type: 'string',
              description: "e.g., '6-12 months', 'currently closed'.",
            },
            application_link: { type: 'string', format: 'uri' },
          },
        },
        annual_fees: {
          type: 'object',
          properties: {
            required: { type: 'boolean' },
            amount: { type: 'number', format: 'float' },
            currency: { type: 'string', default: 'NZD' },
            covers: {
              type: 'array',
              items: { type: 'string' },
              description:
                "What the fees cover (e.g., 'water', 'tools', 'maintenance').",
            },
          },
        },
        requirements_rules: {
          type: 'array',
          items: { type: 'string' },
          description:
            "Key rules or requirements for gardeners (e.g., 'organic only', 'minimum hours worked').",
        },
        plot_availability: {
          type: 'string',
          enum: ['currently full', 'some plots available', 'unknown'],
        },
      },
    },
    community_engagement: {
      type: 'object',
      description: 'Information about community interaction and contact.',
      properties: {
        membership_type: {
          type: 'array',
          items: { type: 'string' },
          description:
            "Types of members accepted (e.g., 'individual gardeners', 'families', 'community groups').",
        },
        contact: {
          type: 'object',
          properties: {
            email: { type: 'string', format: 'email' },
            phone: { type: 'string' },
            website_url: { type: 'string', format: 'uri' },
            social_media_urls: {
              type: 'array',
              items: { type: 'string', format: 'uri' },
            },
          },
        },
        volunteer_opportunities: {
          type: 'object',
          properties: {
            available: { type: 'boolean' },
            tasks: {
              type: 'array',
              items: { type: 'string' },
              description:
                "Examples of volunteer tasks (e.g., 'weeding', 'event support', 'committee roles').",
            },
            contact_for_volunteering: { type: 'string', format: 'email' },
          },
        },
        events_workshops: {
          type: 'object',
          properties: {
            offered: { type: 'boolean' },
            frequency: {
              type: 'string',
              description: "e.g., 'monthly', 'seasonal', 'ad-hoc'.",
            },
            event_calendar_url: { type: 'string', format: 'uri' },
          },
        },
        governance_structure: {
          type: 'string',
          description:
            "How the garden is managed (e.g., 'volunteer-run', 'non-profit organization', 'council-managed').",
        },
        partnerships: {
          type: 'array',
          items: { type: 'string' },
          description: 'Names of notable partner organizations.',
        },
      },
    },
    operational_details: {
      type: 'object',
      description: 'Information about garden operation and rules.',
      properties: {
        operating_hours: {
          type: 'string',
          description:
            "General access times (e.g., 'Dawn to Dusk', '24/7 access for members', 'specific hours').",
        },
        seasonality: {
          type: 'string',
          description:
            "When the garden is active (e.g., 'open year-round', 'seasonal closure Nov-Mar').",
        },
        safety_security: {
          type: 'array',
          items: { type: 'string' },
          description:
            "Safety and security measures (e.g., 'fenced', 'gated access', 'security cameras').",
        },
        pest_disease_management_philosophy: {
          type: 'string',
          description:
            "Approach to pest and disease management (e.g., 'organic', 'integrated pest management', 'conventional').",
        },
      },
    },
    media: {
      type: 'object',
      description: 'Links to images and videos.',
      properties: {
        main_photo_url: {
          type: 'string',
          format: 'uri',
          description: 'URL to a high-quality main image of the garden.',
        },
        gallery_photo_urls: {
          type: 'array',
          items: { type: 'string', format: 'uri' },
          description:
            'URLs to additional photos of the garden (facilities, plots, events).',
        },
        video_tour_url: {
          type: 'string',
          format: 'uri',
          description: 'URL to a video tour of the garden.',
        },
      },
    },
  },
  required: [
    'garden_id',
    'garden_name',
    'status',
    'address',
    'coordinates',
    'plot_information',
    'community_engagement',
    'operational_details',
  ],
};

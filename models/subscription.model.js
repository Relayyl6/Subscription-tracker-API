import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [
            true,
            'Subscription name is required'
        ],
        trim: true,
        minLength: 2,
        maxLength: 50,
    },
    price: {
        type: Number,
        required: [
            true,
            'Subscription price is required'
        ],
        min: [
            0,
            'Price must be greater than 0'
        ],
        max: [
            1999,
            'Price must be less than 1999'
        ]
    },
    currency: {
        type: String,
        enum: ['USD', 'EUR', 'GBP', 'NGN'],
        default: 'USD'
    },
    frequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'annually'],
        required: true
    },
    category: {
        type: String,
        enum: ['sports', 'news', 'entertainment', "lifestyle", 'technology', 'finance', 'politics', 'other'],
        required: true
    },
    paymentMethod: {
        type: String,
        required: true,
        trim: true,
    },
    status : {
        type: String,
        enum: ['active', 'cancelled', 'pending', 'expired'],
        default: 'active',
    },
    startDate: {
        type: Date,
        required: true,
        validate: {
            validator: (value) => value <= new Date(),
            message: "Start Date must be in the past"
        }
    },
    renewalDate: {
        type: Date,
        validate: {
            validator: function (value) {
                return value > this.startDate
            },
            message: "Renewal Date must be in the future, after teh start date"
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    }
}, { timestamps: true })

subscriptionSchema.pre('save', function (next) {
    // ensure startDate exists
    if (!this.startDate) return next();

    // guard: require frequency
    if (!this.frequency) {
    // skip computing renewalDate if frequency unknown — or set default
        return next();
    }

    if (!this.renewalDate) {
        const renewalPeriod = {
            daily: 1,
            weekly: 7,
            monthly: 30,
            annually: 365
        };

        this.renewalDate = new Date(this.startDate);
        this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriod[this.frequency])
    }

    const addPeriod = (date, freq) => {
        const newDate = new Date(date);
        switch (freq) {
            case 'daily':
                newDate.setDate(newDate.getDate() + 1);
                break;
            case 'weekly':
                newDate.setDate(newDate.getDate() + 7);
                break;
            case 'monthly':
                newDate.setMonth(newDate.getMonth() + 1);
                break;
            case 'annually':
                newDate.setFullYear(newDate.getFullYear() + 1);
                break;
            default:
                return null;
        }
        return newDate;
    };

    if (!this.renewalDate) {
        const nextRenewal = addPeriod(this.startDate, this.frequency);
        if (nextRenewal) this.renewalDate = nextRenewal;
    }

    // AutoUpdate the status if the renewal date has passed
    if (this.renewalDate && this.renewalDate < new Date()) {
        this.status = 'expired';
    }

    next()
})

const subscriptionModel = mongoose.model("Subscription", subscriptionSchema)

export default subscriptionModel